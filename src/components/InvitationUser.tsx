import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import {
	addCollectionData,
	addItemData,
	useCollectionItem,
	useCollectionList,
} from "@/hooks/useData";
import IUser, { IFriend } from "@/types/IUser";
import { getCookie } from "cookies-next";
import Image from "next/image";

export default function InvitationUser({
	uid,
	state,
	date,
}: {
	uid: string;
	date: string;
	state: "pending" | "accept" | "reject" | "abort";
}) {
	const currentUID = getCookie(COOKIES.UID) || "";
	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, uid]);

	const { data: friends } = useCollectionList<IFriend>([
		COLLECTIONS.USERS,
		uid,
		COLLECTIONS.FRIENDS,
	]);

	function onAccept() {
		addItemData([COLLECTIONS.USERS, uid, COLLECTIONS.REQUESTS, date])({
			uid: currentUID,
			date,
			state: "accept",
		});
		addItemData([
			COLLECTIONS.USERS,
			currentUID,
			COLLECTIONS.INVITATION,
			date,
		])({
			uid,
			date,
			state: "accept",
		});
		if (friends.some((friend) => friend.uid == currentUID)) return;
		addCollectionData([COLLECTIONS.USERS, currentUID, COLLECTIONS.FRIENDS])(
			{
				date: new Date().toISOString(),
				uid,
			},
			"uid"
		);
		addCollectionData([COLLECTIONS.USERS, uid, COLLECTIONS.FRIENDS])(
			{
				date: new Date().toISOString(),
				uid: currentUID,
			},
			"uid"
		);
	}

	return user ? (
		<div className=" bg-white flex items-start gap-3 rounded-md mx-3 my-2 p-3 shadow-md">
			<Image
				className=" h-fit rounded-full"
				src={user.photo || ""}
				width={40}
				height={40}
				alt=""
			/>
			<div>
				<p className=" mb-3 font-semibold text-sm">{user.displayName}</p>
				{state == "pending" ? (
					<div className=" flex gap-3">
						<button
							onClick={onAccept}
							className=" cursor-pointer duration-200 active:bg-sky-600 text-xs px-8 py-[6px] bg-sky-500 rounded-lg font-medium text-white"
						>
							Accept
						</button>
						<button className=" cursor-pointer duration-200 active:bg-slate-100 text-xs px-2 py-[6px] bg-white-400 rounded-lg font-medium text-gray-700">
							Denied
						</button>
					</div>
				) : null}
			</div>
		</div>
	) : null;
}
