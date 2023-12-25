import { IGunUserInstance } from "gun";
import useDB, { getDB } from "./useDB";

import "gun/sea";

export default function useUser() {
	const db = getDB();

	const user = db?.user().recall({ sessionStorage: true });

	return user as IGunUserInstance;
}
