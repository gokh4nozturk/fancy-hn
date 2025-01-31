"use client";

import { useRouter } from "next/navigation";
import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

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
				onClick={() => handlePageChange(1)}
				disabled={currentPage <= 1}
				className="pagination-button"
			>
				<ChevronFirst className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className="pagination-button"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>
			<span className="text-muted-foreground">
				Page {currentPage} / {totalPages}
			</span>
			<button
				type="button"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				className="pagination-button"
			>
				<ChevronRight className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => handlePageChange(totalPages)}
				disabled={currentPage >= totalPages}
				className="pagination-button"
			>
				<ChevronLast className="h-4 w-4" />
			</button>
		</div>
	);
}
