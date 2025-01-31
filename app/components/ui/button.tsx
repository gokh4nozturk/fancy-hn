import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "ghost";
	size?: "default" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "default", ...props }, ref) => {
		return (
			<button
				className={cn(
					"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
					{
						"bg-primary text-primary-foreground shadow hover:bg-primary/90":
							variant === "default",
						"hover:bg-accent hover:text-accent-foreground": variant === "ghost",
						"h-9 px-4": size === "default",
						"h-9 w-9": size === "icon",
					},
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button };
