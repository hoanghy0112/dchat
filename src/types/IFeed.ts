export default interface IFeed {
	date: string;
	content: string;
	type?: "poll";
	// images?: string;
	isVisible: boolean;
	uid: string;
}

export interface IPoll {
	uid: string;
	question: string;
	date: string;
}

export interface IAnswer {
	uid: string;
	date: string;
	choice: string;
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
