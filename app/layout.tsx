import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "./providers/ThemeProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Fancy Hacker News",
		template: "%s | Fancy Hacker News",
	},
	description:
		"Experience Hacker News with a modern and user-friendly interface. Latest technology news, discussions, and content.",
	keywords: [
		"hacker news",
		"technology",
		"software",
		"programming",
		"startup",
		"entrepreneurship",
	],
	authors: [{ name: "Gökhan Öztürk" }],
	creator: "Gökhan Öztürk",
	publisher: "Gökhan Öztürk",
	metadataBase: new URL("https://fancy-hn.vercel.app"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://fancy-hn.vercel.app",
		title: "Fancy Hacker News",
		description:
			"Experience Hacker News with a modern and user-friendly interface. Latest technology news, discussions, and content.",
		siteName: "Fancy Hacker News",
	},
	twitter: {
		card: "summary_large_image",
		title: "Fancy Hacker News",
		description:
			"Experience Hacker News with a modern and user-friendly interface",
		creator: "@gokh4nozturk",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "google-site-verification-code", // Google Search Console verification code to be added
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Tooltip.Provider delayDuration={100}>{children}</Tooltip.Provider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
