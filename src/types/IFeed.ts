export default interface IFeed {
	date: string;
	content: string;
	// images?: string;
	isVisible: boolean;
	uid: string;
}

export interface IFeedPhoto {
	date: string;
	url: string;
}

export interface IComment {
	content: string;
	uid: string;
	isVisible: boolean;
	date: string;
}

export interface ILike {
	uid: string;
	date: string;
}
