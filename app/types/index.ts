export interface Story {
	id: number;
	title: string;
	url?: string;
	score: number;
	by: string;
	time: number;
	descendants: number;
	kids?: number[];
	type: string;
	text?: string;
	deleted?: boolean;
	dead?: boolean;
	parent?: number;
	poll?: number;
	parts?: number[];
}

export interface Comment {
	id: number;
	by: string;
	text: string;
	time: number;
	kids?: number[];
	parent: number;
	deleted?: boolean;
	dead?: boolean;
	type: string;
}

export interface User {
	id: string;
	created: number;
	karma: number;
	about?: string;
	submitted?: number[];
}

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
}
