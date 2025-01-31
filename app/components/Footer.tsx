"use client";

import { motion } from "framer-motion";
import { GithubIcon } from "lucide-react";

export function Footer() {
	return (
		<motion.footer
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			transition={{ type: "spring", stiffness: 100 }}
			className="bg-card border-t sticky bottom-0 max-sm:pb-10"
		>
			<div className="max-w-4xl mx-auto px-4 h-14 flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
				<p className="text-muted-foreground">
					&copy; {new Date().getFullYear()} Hacker News. All rights reserved.
				</p>
				<p className="text-orange-500 flex items-center gap-1">
					<GithubIcon className="w-4 h-4" /> created by{" "}
					<a
						href="https://github.com/gokh4nozturk"
						className="hover:underline max-sm:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						gokh4nozturk
					</a>
				</p>
			</div>
		</motion.footer>
	);
}
