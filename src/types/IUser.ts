export default interface IUser {
	uid: string;
	displayName: string;
	email: string;
	photo?: string;
}

export interface IRequest {
	uid: string;
	date: string;
	state: "pending" | "accept" | "reject" | "abort";
}

export interface IInvitation {
	uid: string;
	date: string;
	state: "pending" | "accept" | "reject" | "abort";
}
