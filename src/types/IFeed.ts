import IUser from "./IUser";

export default interface IFeed {
	// id: string;
	date: string;
	content: string;
	isVisible: boolean;
	uid: string;
}

export interface IComment {
	content: string;
	uid: string;
	isVisible: boolean;
	date: Date;
}
