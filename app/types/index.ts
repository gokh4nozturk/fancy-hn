export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  kids?: number[];
  type: string;
}

export interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
  parent: number;
  type: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
} 