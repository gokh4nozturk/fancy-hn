"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") || "");

	const updateSearch = (newQuery: string) => {
		setQuery(newQuery);
		const params = new URLSearchParams(searchParams.toString());

		if (newQuery) {
			params.set("q", newQuery);
		} else {
			params.delete("q");
		}

		params.delete("page");
		router.push(`/?${params.toString()}`);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<form onSubmit={handleSearch} className="flex gap-2">
			<Input
				type="search"
				placeholder="Search..."
				value={query}
				onChange={(e) => updateSearch(e.target.value)}
				className="w-full max-w-xs"
			/>
			<Button type="submit" size="icon" variant="ghost">
				<Search className="h-4 w-4" />
			</Button>
		</form>
	);
}
