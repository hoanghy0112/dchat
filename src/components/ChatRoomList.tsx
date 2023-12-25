import UserSearch from "@/components/UserSearch";
import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import useDB, { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import IUser from "@/types/IUser";
import { getCookie } from "cookies-next";

import { cookies } from "next/headers";
import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";

export default function ChatRoomList({
	receiverUID,
}: {
	receiverUID?: string;
}) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const [chatRooms, setChatRooms] = useState<Map<String, IChatRoom>>(
		new Map()
	);
	const [receiverProfile, setReceiverProfile] = useState<IUser>();

	useEffect(() => {
		if (receiverUID) {
			db.get(DB_KEYS.USERS)
				.get(receiverUID)
				.once((data: IUser) => {
					setReceiverProfile(data);
				});
		}
	}, [receiverUID]);

	useEffect(() => {
		db.get(DB_KEYS.ROOMS)
			.map()
			.once((data: IChatRoom) => {
				if (!data?.users) return;
				const userList = data.users
					.split(",")
					.filter((value) => value.length > 1);
				if (userList.length == 2 && userList.includes(uid)) {
					chatRooms.set(data.id, data);
					setChatRooms(new Map(chatRooms.entries()));
				}
			});
	}, [uid]);

	return (
		<ul>
			{Array.from(chatRooms.values()).map((room) => (
				<ChatItem key={room.id} room={room} />
			))}
		</ul>
	);
}
