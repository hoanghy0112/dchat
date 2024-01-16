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
		<div className=" flex p-4 relative">
			{user ? (
				<>
					<Image
						className=" rounded-full"
						src={user.photo || ""}
						width={50}
						height={50}
						alt={""}
					/>
					<div className=" mx-3 bg-slate-300 rounded-md">
						<div className=" mx-3 flex gap-5 justify-center items-center">
							<p className=" font-semibold">{user?.displayName}</p>
							<p className=" text-sm">{date.slice(0, 10)}<span>:{date.slice(11, 16)}</span></p>
						</div>
						<p className=" mx-3">{content}</p>
					</div>
				</>
			) : null}
		</div>
	);
}
