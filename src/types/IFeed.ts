export default interface IFeed {
	date: string;
	content: string;
	images?: string;
	isVisible: boolean;
	uid: string;
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
