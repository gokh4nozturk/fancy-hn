'use client';

import { useState, useEffect } from 'react';
import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import * as Dialog from '@radix-ui/react-dialog';
import { Bot, X, Loader2, Key, AlertTriangle } from 'lucide-react';
import { summarizeStory } from '../lib/api';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '../lib/utils';

interface Props {
  story: Story | null;
  onStorySelect: (story: Story) => void;
}

export default function StoryDialog({ story, onStorySelect }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    setApiKey(storedKey);
  }, []);

  const handleSummarize = async () => {
    if (!story?.url || !apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeStory(story.url, apiKey);
      if ('error' in result) {
        setError(result.error);
        if (result.error.includes('API kotanız dolmuş') || result.error.includes('Geçersiz API anahtarı')) {
          removeStoredApiKey();
          setApiKey(null);
          setShowApiKeyInput(true);
        }
      } else {
        setSummary(result.summary);
      }
    } catch (error) {
      setError('Özet oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey) {
      setStoredApiKey(tempApiKey);
      setApiKey(tempApiKey);
      setShowApiKeyInput(false);
      setTempApiKey('');
      setError(null);
      setSummary(null);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          onClick={() => story && onStorySelect(story)}
          className="p-2 rounded-full hover:bg-orange-100 transition-colors"
        >
          <Bot className="text-orange-500" />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl w-[90vw] max-w-md data-[state=open]:animate-contentShow">
          {story && (
            <>
              <Dialog.Title className="text-xl font-bold mb-4">
                {story.title}
              </Dialog.Title>
              <div className="space-y-4">
                {!apiKey && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      AI özeti için OpenAI API anahtarı gereklidir
                    </p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {error}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Yazar: {story.by}
                </p>
                <p className="text-sm text-gray-600">
                  Puan: {story.score}
                </p>
                <p className="text-sm text-gray-600">
                  Yorum: {story.descendants}
                </p>
                <p className="text-sm text-gray-600">
                  Paylaşım: {formatDistanceToNow(story.time * 1000, { locale: enUS })} önce
                </p>
                {story.url && (
                  <div className="space-y-2">
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-orange-500 hover:underline"
                    >
                      Hikayeyi Görüntüle →
                    </a>
                    {showApiKeyInput ? (
                      <div className="space-y-2">
                        <input
                          type="password"
                          value={tempApiKey}
                          onChange={(e) => setTempApiKey(e.target.value)}
                          placeholder="OpenAI API Key'inizi girin"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <button
                          type="button"
                          onClick={handleSaveApiKey}
                          className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        >
                          API Key'i Kaydet
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSummarize}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Özet Oluşturuluyor...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4" />
                            AI Özeti Oluştur
                          </>
                        )}
                      </button>
                    )}
                    {summary && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-md">
                        <h3 className="font-semibold mb-2">AI Özeti:</h3>
                        <p className="text-sm text-gray-700">{summary}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 