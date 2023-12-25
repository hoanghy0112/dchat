"use client";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function ChatBox({ receiverUID }: { receiverUID?: string }) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const [room, setRoom] = useState<IChatRoom>();

	const roomTitle = [uid, receiverUID].sort().join("-");

	useEffect(() => {
		if (!receiverUID) return;
		const newRoom = db
			.get(roomTitle)
			.get(DB_KEYS.ROOM_INFO)
			.put({
				id: roomTitle,
				users: [uid, receiverUID].sort().join(","),
			});
		db.get(DB_KEYS.ROOMS).get(roomTitle).get(DB_KEYS.ROOM_INFO).set(newRoom);
	}, [receiverUID, roomTitle, uid]);

	useEffect(() => {
		db.get(DB_KEYS.ROOMS)
			.get(roomTitle)
			.get(DB_KEYS.ROOM_INFO)
			.once((data: IChatRoom) => {
				console.log([data, db]);
				setRoom(data);
			});
	}, [roomTitle]);

	return <div className=" flex flex-col">
		<div></div>
	</div>;
}
