import { DB_KEYS } from "@/constants/dbKeys";
import { useCollectionItem, useItem } from "@/hooks/useData";
import { IComment } from "@/types/IFeed";
import IUser from "@/types/IUser";

import Image from "next/image";

export default function CommentItem({
	info: { content, uid, date, isVisible },
}: {
	info: IComment;
}) {
	const user = useCollectionItem<IUser>([DB_KEYS.USERS, uid]);

	return (
		<div className=" flex">
			{user ? (
				<>
					<Image
						className=" rounded-full"
						src={user.photo || ""}
						width={50}
						height={50}
						alt={""}
					/>
					<div>
						<div className=" flex gap-5">
							<p className=" font-semibold">{user?.displayName}</p>
							<p>{date}</p>
						</div>
						<p>{content}</p>
					</div>
				</>
			) : null}
		</div>
	);
}
