"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export function RefreshButton() {
	const router = useRouter();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = () => {
		setIsRefreshing(true);
		router.refresh();
		setTimeout(() => setIsRefreshing(false), 1000);
	};

	return (
		<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
			<Button
				variant="ghost"
				size="icon"
				aria-label="Refresh stories"
				className="hover:text-orange-500"
				onClick={handleRefresh}
				disabled={isRefreshing}
			>
				<RefreshCw
					className={`h-5 w-5 transition-all ${isRefreshing ? "animate-spin" : ""}`}
				/>
			</Button>
		</motion.div>
	);
}
