'use client';

import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

interface Props {
  stories: Story[];
  currentPage: number;
  totalPages: number;
}

export default function StoryList({ stories }: Props) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <article 
          key={story.id} 
          className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-2">
            <span className="text-sm text-muted-foreground min-w-[2rem] text-right mt-1">
              {story.score}
            </span>
            
            <div className="flex-1 space-y-1">
              <h2>
                <a 
                  href={story.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:text-primary transition-colors hover:underline hover:text-orange-500 max-sm:text-orange-500 max-sm:text-sm"
                >
                  {story.title}
                </a>
                {story.url && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({new URL(story.url).hostname})
                  </span>
                )}
              </h2>
              
              <div className="text-sm text-muted-foreground">
                <span>{story.by}</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(story.time * 1000, { locale: enUS })} ago</span>
                <span className="mx-1">•</span>
                <span>{story.descendants} comments</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 