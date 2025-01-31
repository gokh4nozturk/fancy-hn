'use client';

import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import * as Dialog from '@radix-ui/react-dialog';
import { Bot, X } from 'lucide-react';

interface Props {
  story: Story | null;
  onStorySelect: (story: Story) => void;
}

export default function StoryDialog({ story, onStorySelect }: Props) {
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
                <p className="text-sm text-gray-600">
                  Author: {story.by}
                </p>
                <p className="text-sm text-gray-600">
                  Points: {story.score}
                </p>
                <p className="text-sm text-gray-600">
                  Comments: {story.descendants}
                </p>
                <p className="text-sm text-gray-600">
                  Posted: {formatDistanceToNow(story.time * 1000, { locale: enUS })} ago
                </p>
                {story.url && (
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-orange-500 hover:underline"
                  >
                    View Story →
                  </a>
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