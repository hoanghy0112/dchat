import GUN from "gun/gun";

export default function useDB() {
	const db = GUN();

	return db;
}

export function getDB() {
	return GUN();
}
