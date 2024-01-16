"use client";

import InvitationUser from "@/components/InvitationUser";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import FONT from "@/constants/fontFamily";
import { useCollectionList } from "@/hooks/useData";
import { IInvitation } from "@/types/IUser";
import { getCookie } from "cookies-next";
import FriendMenu from "../menu";

export default function Page() {
	const currentUID = getCookie(COOKIES.UID) || "";
	const { data: invitations } = useCollectionList<IInvitation>([
		COLLECTIONS.USERS,
		currentUID,
		COLLECTIONS.INVITATION,
	], "uid");

	return (
		<div className=" relative w-screen h-screen flex flex-col">
			<div className=" mt-5 flex justify-between p-5">
				<div className=" flex flex-col gap-3">
					<h1 className={` font-bold text-xl ${FONT.primary.className}`}>
						Invitation list
					</h1>
				</div>
			</div>
			<FriendMenu active={"Invitation"} />
			<div className=" mt-4 flex flex-col gap-2">
				{invitations
					.filter(({ state }) => state == "pending")
					.map(({ uid, date, state }) => (
						<InvitationUser key={date} uid={uid} state={state} />
					))}
			</div>
		</div>
	);
}
