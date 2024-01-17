export type FeedType = "poll" | "feed" | undefined;

export default interface IFeed {
	date: string;
	content: string;
	type?: FeedType;
	isVisible: boolean;
	uid: string;
}

export interface IPoll {
	type?: FeedType;
	uid: string;
	question: string;
	date: string;
	choices: string;
}

export interface IVote {
	uid: string;
	date: string;
	choices: string;
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
