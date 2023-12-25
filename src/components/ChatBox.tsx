"use client";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export default function ChatBox({ receiverUID }: { receiverUID?: string }) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const roomTitle = [uid, receiverUID].sort().join("-");

	useEffect(() => {
		const room = db.get(roomTitle).put({
			id: roomTitle,
			users: [uid, receiverUID].sort().join(","),
		});
		db.get(DB_KEYS.ROOMS).set(room);
	}, [receiverUID, roomTitle, uid]);

	return <p></p>;
}
