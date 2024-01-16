import IUser, { IRequest } from "@/types/IUser";
import { useCollectionList } from "./useData";
import COLLECTIONS from "@/constants/collection";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";

export default function useRecommendUser(): IUser[] {
	const currentUID = getCookie(COOKIES.UID) || "";

	const { data: friends } = useCollectionList<IUser>([
		COLLECTIONS.USERS,
		currentUID || "",
		COLLECTIONS.FRIENDS,
	]);

	const { data: requests } = useCollectionList<IRequest>([
		COLLECTIONS.USERS,
		currentUID || "",
		COLLECTIONS.REQUESTS,
	]);

	const { data: users } = useCollectionList<IUser>(
		[COLLECTIONS.USERS],
		"email"
	);

	return users.filter(
		(user) =>
			friends.every((friend) => friend.uid != user.uid) &&
			requests.every((request) => request.uid != user.uid) &&
			user.uid != currentUID
	);
}
