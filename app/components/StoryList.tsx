'use client';

import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import Pagination from './Pagination';
import { useRouter } from 'next/navigation';

interface Props {
  stories: Story[];
  currentPage: number;
  totalPages: number;
}

export default function StoryList({ stories, currentPage, totalPages }: Props) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div>
      <div className="space-y-4">
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
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 