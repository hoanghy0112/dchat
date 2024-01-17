import COLLECTIONS from "@/constants/collection";
import { useCollectionList, useList } from "@/hooks/useData";
import IFeed, { IPoll } from "@/types/IFeed";
import FeedItem from "./FeedItem";
import PollCreating from "./PollCreating";
import PollItem from "./PollItem";

export default function FeedList() {
	const { data: feeds } = useCollectionList<IFeed>([COLLECTIONS.FEED]);

	const { data: polls } = useCollectionList<IPoll>([COLLECTIONS.POLLS]);

	return (
		<div className=" flex flex-col gap-2">
			<PollCreating />
			{feeds.map((value, index) =>
				index % 5 != 0 ? (
					<FeedItem info={value} key={value.date} />
				) : (
					<>
						{polls.length > index / 5 ? (
							<PollItem
								key={`poll-${index}`}
								poll={polls.at(Math.round(index / 5))}
							/>
						) : null}
						<FeedItem info={value} key={value.date} />
					</>
				)
			)}
		</div>
	);
}
