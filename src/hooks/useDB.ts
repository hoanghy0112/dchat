import GUN from "gun/gun";

const db = GUN({ peers: ["https://dchat-api.hoanghy.space/gun"] });

export default function useDB() {
	const db = GUN({ peers: ["https://dchat-api.hoanghy.space/gun"] });

	return db;
}

export function getDB() {
	return db;
}

console.log({ db });
