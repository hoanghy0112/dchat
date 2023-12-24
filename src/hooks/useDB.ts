import GUN from "gun/gun";
import "gun/sea";
import "gun/axe";

export default function useDB() {
	const db = GUN(location.origin + "/gun");

	return db;
}

export function getDB() {
	return GUN(location.origin + "/gun");
}
