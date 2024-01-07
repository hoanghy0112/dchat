import GUN from "gun/gun";

const db = GUN(["http://localhost:8765/gun"]);

export default function useDB() {
	const db = GUN(["http://localhost:8765/gun"]);

	return db;
}

export function getDB() {
	return db;
}

console.log({ db });
