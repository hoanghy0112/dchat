import { DB_KEYS } from "@/constants/dbKeys";
import { useCollectionItem, useItem } from "@/hooks/useData";
import { IComment } from "@/types/IFeed";
import IUser from "@/types/IUser";
import moment from "moment";

import Image from "next/image";

export default function CommentItem({
	info: { content, uid, date, isVisible },
}: {
	info: IComment;
}) {
	const user = useCollectionItem<IUser>([DB_KEYS.USERS, uid]);

	return (
		<div className=" flex p-2 relative">
			{user ? (
				<>
					<Image
						className=" rounded-full relative h-fit"
						src={user.photo || ""}
						width={30}
						height={30}
						alt={""}
					/>
					<div className=" w-full px-2">
						<div className=" w-fit px-3 pr-5 py-1 bg-slate-200 rounded-md">
							<div className=" mb-1 flex flex-col gap-2 mobile:max-sm:gap-0 items-start">
								<p className=" font-semibold text-sm">
									{user?.displayName}
								</p>
							</div>
							<div className=" flex flex-wrap-reverse whitespace-break-spaces mobile:max-sm:w-max-3/4">
								<p className=" break-words whitespace-break-spaces text-wrap mobile:max-sm:text-sm mobile:max-sm:max-w-full">
									{content}
								</p>
							</div>
						</div>
						<p className=" ml-1 mt-1 text-sm mobile:max-sm:text-xs">
							{moment(new Date(user.date || new Date())).fromNow()}
						</p>
					</div>
				</>
			) : null}
		</div>
	);
}
