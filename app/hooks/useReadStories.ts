import { useState, useEffect } from 'react';

const STORAGE_KEY = 'read-stories';

export function useReadStories() {
  const [readStories, setReadStories] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setReadStories(JSON.parse(stored));
    }
  }, []);

  const markAsRead = (storyId: number) => {
    const updatedReadStories = [...readStories, storyId];
    setReadStories(updatedReadStories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReadStories));
  };

  const isRead = (storyId: number) => {
    return readStories.includes(storyId);
  };

  return {
    markAsRead,
    isRead,
    readStories
  };
} 