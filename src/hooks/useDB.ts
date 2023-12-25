import GUN from "gun/gun";

export default function useDB() {
	const db = GUN(["http://localhost:8765/gun"]);

	return db;
}

export function getDB() {
	return GUN(["http://localhost:8765/gun"]);
}
