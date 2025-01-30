'use client';

import { useRouter } from 'next/navigation';

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="pagination-button"
      >
        Önceki
      </button>
      <span className="text-muted-foreground">
        Sayfa {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="pagination-button"
      >
        Sonraki
      </button>
    </div>
  );
} 