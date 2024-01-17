import COLLECTIONS from "@/constants/collection";
import { IPoll, IVote } from "@/types/IFeed";
import { useCollectionList } from "./useData";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";

export default function useRecentPoll() {
	const uid = getCookie(COOKIES.UID);

	const { data: polls } = useCollectionList<IPoll>([COLLECTIONS.POLLS]);
	const poll = polls.find((poll) => poll.uid == uid);

	const { data: votes } = useCollectionList<IVote>([
		COLLECTIONS.POLLS,
		poll?.date || "",
		COLLECTIONS.VOTES,
	]);

	return { poll, votes };
}
