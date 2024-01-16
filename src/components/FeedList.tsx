import COLLECTIONS from "@/constants/collection";
import { useCollectionList, useList } from "@/hooks/useData";
import IFeed from "@/types/IFeed";
import FeedItem from "./FeedItem";

export default function FeedList() {
	const { data: feeds } = useCollectionList<IFeed>([COLLECTIONS.FEED]);
	console.log({ feeds });

	return (
		<div className=" flex flex-col gap-5">
			{feeds.map((value) => (
				<FeedItem info={value} key={value.date} />
			))}
		</div>
	);
}
