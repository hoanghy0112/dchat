export default interface IChatRoom {
	id?: string;
	users?: string;
	title?: string;
	description?: string;
	owner?: string;
	isCalling?: boolean;
}
