import { DB_KEYS } from "@/constants/dbKeys";
import { useItem } from "@/hooks/useData";
import IFeed from "@/types/IFeed";
import IUser from "@/types/IUser";
import Image from "next/image";

export default function FeedItem({
	info: { date, content, isVisible, uid },
}: {
	info: IFeed;
}) {
	const [user] = useItem<IUser>(DB_KEYS.USERS, uid);

	return (
		<div>
			{user ? (
				<div className=" flex gap-3">
					<Image
						className=" rounded-full"
						src={user.photo || ""}
						width={50}
						height={50}
						alt={""}
					/>
					<div>
						<p>{user.displayName}</p>
						<p>{date}</p>
					</div>
				</div>
			) : null}
			<p>{content}</p>
			<div className=" flex justify-between">
				{/* <p>{likes} likes</p> */}
				<p>Comments</p>
			</div>
		</div>
	);
}
