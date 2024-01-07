import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import { getCookie } from "cookies-next";

import { useEffect, useState } from "react";

export default function useChatRoomList() {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const [chatRooms, setChatRooms] = useState<Map<string, IChatRoom>>(
		new Map()
	);

	useEffect(() => {
		db.get(DB_KEYS.ROOMS)
			.map()
			.once((data: IChatRoom) => {
				if (!data?.users) return;
				const userList = data.users
					.split(",")
					.filter((value) => value.length > 1);
				if (userList.length == 2 && userList.includes(uid)) {
					if (data?.id) chatRooms.set(data.id, data);
					setChatRooms(new Map(chatRooms.entries()));
				}
			});
	}, [uid]);

	return chatRooms;
}
