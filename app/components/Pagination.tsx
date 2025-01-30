import React from 'react';
import type { PaginationProps } from '../types';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded bg-orange-500 text-white disabled:bg-gray-300"
      >
        İlk
      </button>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded bg-orange-500 text-white disabled:bg-gray-300"
      >
        Önceki
      </button>
      
      <span className="mx-2">
        Sayfa {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded bg-orange-500 text-white disabled:bg-gray-300"
      >
        Sonraki
      </button>
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded bg-orange-500 text-white disabled:bg-gray-300"
      >
        Son
      </button>
    </div>
  );
} 