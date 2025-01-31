"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
				className="w-full max-w-xs bg-background text-foreground placeholder:text-muted-foreground border-border focus-visible:ring-orange-500/20"
			/>
			<Button
				type="submit"
				size="icon"
				variant="ghost"
				className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
			>
				<Search className="h-4 w-4" />
			</Button>
		</form>
	);
}
