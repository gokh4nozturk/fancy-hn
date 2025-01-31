'use client';

import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useState } from 'react';
import StoryDialog from './StoryDialog';
import { motion } from 'framer-motion';

interface Props {
  stories: Story[];
  currentPage: number;
  totalPages: number;
}

export default function StoryList({ stories }: Props) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <div className="space-y-4">
      {stories.map((story, index) => (
        <motion.article 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          key={story.id} 
          className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-2">
            <div>
              <StoryDialog 
                story={story} 
                onStorySelect={setSelectedStory} 
              />
            </div>
            
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
                <span>{story.score}</span>
                <span className="mx-1">•</span>
                <span>{story.by}</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(story.time * 1000, { locale: enUS })} ago</span>
                <span className="mx-1">•</span>
                <span>{story.descendants} comments</span>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
} 