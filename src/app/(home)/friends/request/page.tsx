"use client";

import InvitationUser from "@/components/InvitationUser";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import FONT from "@/constants/fontFamily";
import { useCollectionList } from "@/hooks/useData";
import { IInvitation, IRequest } from "@/types/IUser";
import { getCookie } from "cookies-next";
import FriendMenu from "../menu";
import RequestUser from "@/components/RequestUser";

export default function Page() {
	const currentUID = getCookie(COOKIES.UID) || "";
	const { data: requests } = useCollectionList<IRequest>(
		[COLLECTIONS.USERS, currentUID, COLLECTIONS.REQUESTS],
		"uid"
	);

	return (
		<div className=" relative w-full flex flex-col">
			<div className=" mt-5 flex justify-between p-5">
				<div className=" flex flex-col gap-3">
					<h1 className={` font-bold text-xl ${FONT.primary.className}`}>
						Request
					</h1>
				</div>
			</div>
			<FriendMenu active={"Request"} />
			<div className=" mt-4 flex flex-col gap-2">
				{requests
					// .filter(({ state }) => state == "pending")
					.map(({ uid, date, state }) => (
						<RequestUser key={date} uid={uid} state={state} />
					))}
			</div>
		</div>
	);
}
