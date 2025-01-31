'use client';

import { motion } from 'framer-motion';
import StoryList from './StoryList';
import Pagination from './Pagination';
import type { Story } from '../types';

interface Props {
  stories: Story[];
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export function MainContent({ stories, currentPage, totalPages, searchQuery }: Props) {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='flex flex-col sm:flex-row gap-2 justify-between items-center mb-8'
      >
        <h1 className="text-2xl font-bold">
          {searchQuery ? `Search: ${searchQuery}` : 'Hacker News'}
        </h1>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </motion.div>
      <StoryList 
        stories={stories}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </motion.main>
  );
} 