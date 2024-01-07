import { COOKIES } from "@/constants/cookies";
import { getDB } from "@/hooks/useDB";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function useAnswer() {
	const uid = getCookie(COOKIES.UID) as string;

	const [isAnswer, setIsAnswer] = useState(false);
	const [roomTitle, setRoomTitle] = useState<string>();

	useEffect(() => {
		getDB()
			.get(`${uid}-answer`)
			.on((data: { uid: string; roomTitle: string; isAnswer: boolean }) => {
				if (!data?.uid) return;
				setIsAnswer(data.isAnswer);
				setRoomTitle(data.roomTitle);
			});

		return () => {
			getDB().get(`${uid}-answer`).off();
		};
	}, [uid]);

	return { isAnswer, roomTitle };
}
