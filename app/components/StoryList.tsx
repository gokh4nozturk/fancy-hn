'use client';

import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Props {
  stories: Story[];
}

export default function StoryList({ stories }: Props) {
  return (
    <div className="space-y-4">
      {stories.map((story, index) => (
        <article key={story.id} className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-start gap-2">
            <span className="text-gray-500">{index + 1}.</span>
            <div>
              <h2 className="font-medium">
                <a href={story.url} target="_blank" rel="noopener noreferrer" 
                   className="hover:underline">
                  {story.title}
                </a>
              </h2>
              <div className="text-sm text-gray-500">
                {story.score} puan | {story.by} tarafından | {' '}
                {formatDistanceToNow(story.time * 1000, { locale: tr })} önce | {' '}
                {story.descendants} yorum
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 