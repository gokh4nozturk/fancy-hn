"use client";

import { motion } from "framer-motion";
import { RefreshButton } from "./RefreshButton";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: "spring", stiffness: 100 }}
			className="bg-card border-b border-border sticky top-0 z-10"
		>
			<div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className="flex items-center gap-2"
				>
					<motion.img
						whileHover={{ rotate: 360 }}
						transition={{ duration: 0.5 }}
						src="/favicon.svg"
						alt="Hacker News"
						className="w-6 h-6"
					/>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="hidden sm:block text-xl font-bold text-orange-500 dark:text-orange-400"
					>
						Hacker News
					</motion.h1>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="block sm:hidden text-xl font-bold text-orange-500 dark:text-orange-400 mr-5"
					>
						HN
					</motion.h1>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className="flex items-center gap-4"
				>
					<SearchBar />
					<RefreshButton />
					<ThemeToggle />
				</motion.div>
			</div>
		</motion.header>
	);
}
