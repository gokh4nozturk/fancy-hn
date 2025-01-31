"use client";

import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
	currentPage: number;
	totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`/?${params.toString()}`);
	};

	return (
		<div className="flex items-center gap-1 text-sm">
			<button
				type="button"
				onClick={() => handlePageChange(1)}
				disabled={currentPage <= 1}
				className="p-1 text-gray-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed"
				aria-label="First page"
			>
				<ChevronFirst className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className="p-1 text-gray-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed"
				aria-label="Previous page"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>
			<span className="text-gray-600 min-w-[5rem] text-center">
				{currentPage} / {totalPages}
			</span>
			<button
				type="button"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				className="p-1 text-gray-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed"
				aria-label="Next page"
			>
				<ChevronRight className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => handlePageChange(totalPages)}
				disabled={currentPage >= totalPages}
				className="p-1 text-gray-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed"
				aria-label="Last page"
			>
				<ChevronLast className="h-4 w-4" />
			</button>
		</div>
	);
}
