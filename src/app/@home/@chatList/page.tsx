"use client";

import ChatRoomList from "@/components/ChatRoomList";
import UserSearch from "@/components/UserSearch";
import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import useDB, { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import IUser from "@/types/IUser";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default function Page({
	searchParams,
}: {
	searchParams?: { [key: string]: string | undefined };
}) {
	const receiverUID = searchParams?.uid;

	return (
		<div className=" flex-1">
			<ChatRoomList receiverUID={receiverUID} />
			<UserSearch className=" mt-5"  />
		</div>
	);
}
