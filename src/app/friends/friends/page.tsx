"use client";

import FriendUser from "@/components/FriendUser";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import FONT from "@/constants/fontFamily";
import { useCollectionList } from "@/hooks/useData";
import { getCookie } from "cookies-next";
import FriendMenu from "../menu";

export default function Page() {
	const currentUID = getCookie(COOKIES.UID) || "";
	const { data: friends } = useCollectionList<{ uid: string }>([
		COLLECTIONS.USERS,
		currentUID,
		COLLECTIONS.FRIENDS,
	]);

	return (
		<div className=" relative w-screen h-screen flex flex-col">
			<div className=" mt-5 flex justify-between p-5">
				<div className=" flex flex-col gap-3">
					<h1 className={` font-bold text-xl ${FONT.primary.className}`}>
						Friends
					</h1>
				</div>
			</div>
			<FriendMenu active={"Friends"} />
			<div className=" mt-4 flex flex-col gap-2">
				{friends.map(({ uid }) => (
					<FriendUser key={uid} uid={uid} />
				))}
			</div>
		</div>
	);
}
