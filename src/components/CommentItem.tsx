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
						className=" rounded-full relative mobile:w-12 mobile:h-12"
						src={user.photo || ""}
						width={50}
						height={50}
						alt={""}
					/>
					<div className=" mx-3 mobile:mx-2 bg-slate-300 rounded-md mobile:w-3/4">
						<div className=" mx-3 flex gap-5 mobile:gap-0 items-center">
							<p className=" font-semibold mobile:text-sm">{user?.displayName}</p>
							<p className=" text-sm mobile:text-xs">{date.slice(0, 10)}<span> {date.slice(11, 16)}</span></p>
						</div>
						<div className=" mx-3 flex flex-wrap-reverse whitespace-break-spaces mobile:w-max-3/4">
							<p className=" text-wrap mobile:text-sm mobile:max-w-full">{content}</p>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}
