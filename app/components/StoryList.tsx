'use client';

import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Props {
  stories: Story[];
}

export default function StoryList({ stories }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {stories.map((story, index) => (
        <article 
          key={story.id} 
          className="flex gap-4 p-3 hover:bg-gray-50 transition-colors rounded-lg"
        >
          <div className="flex flex-col items-center justify-center min-w-[32px]">
            <span className="text-gray-400 text-sm">{index + 1}</span>
            <span className="text-orange-500 font-medium">{story.score}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <a 
                href={story.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg font-medium hover:text-blue-600 transition-colors"
              >
                {story.title}
              </a>
              {story.url && (
                <span className="text-xs text-gray-400">
                  ({new URL(story.url).hostname})
                </span>
              )}
            </div>
            
            <div className="flex gap-3 text-sm text-gray-500">
              <span>{story.by}</span>
              <span>•</span>
              <span>{formatDistanceToNow(story.time * 1000, { locale: tr })} önce</span>
              <span>•</span>
              <span>{story.descendants} yorum</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 