import COLLECTIONS from "@/constants/collection";
import { useCollectionList, useList } from "@/hooks/useData";
import IFeed from "@/types/IFeed";
import FeedItem from "./FeedItem";
import PollCreating from "./PollCreating";

export default function FeedList() {
	const { data: feeds } = useCollectionList<IFeed>([COLLECTIONS.FEED]);

	return (
		<div className=" flex flex-col gap-2">
			<PollCreating />
			{feeds.map((value) => (
				<FeedItem info={value} key={value.date} />
			))}
		</div>
	);
}
