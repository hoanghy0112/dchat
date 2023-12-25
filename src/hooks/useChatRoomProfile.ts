import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function useChatRoomProfile(receiverUID: string) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const [room, setRoom] = useState<IChatRoom>();

	const roomTitle = [uid, receiverUID].sort().join("-");

	useEffect(() => {
		db.get(DB_KEYS.ROOMS)
			.get(roomTitle)
			.get(DB_KEYS.ROOM_INFO)
			.once((data: IChatRoom) => {
				setRoom(data);
			});
	}, [roomTitle]);

	return { room, roomId: roomTitle };
}
