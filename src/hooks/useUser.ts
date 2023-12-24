import GUN, { IGunUserInstance } from "gun";
import useDB from "./useDB";

export default function useUser() {
	const db = useDB();

	const user = db?.user().recall({ sessionStorage: true });

	return user as IGunUserInstance;
}
