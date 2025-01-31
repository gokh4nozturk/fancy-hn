'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Refresh stories"
      className="hover:text-orange-500"
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
} 