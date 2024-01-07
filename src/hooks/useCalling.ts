import { COOKIES } from "@/constants/cookies";
import { getDB } from "@/hooks/useDB";
import peerConnection from "@/services/rtc/connection";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function useCalling(receiverUID: string) {
	const uid = getCookie(COOKIES.UID) as string;

	const [isCalling, setIsCalling] = useState(false);

	useEffect(() => {
		if (!receiverUID || !uid) return;

		console.log({ state: peerConnection?.signalingState });

		getDB()
			.get(`${uid}-call`)
			.get(receiverUID)
			.on((data: { uid: string; isCalling: boolean }) => {
				if (!data?.uid) return;
				setIsCalling(data.isCalling);
			});

		return () => {
			getDB().get(`${uid}-call`).get(receiverUID).off();
		};
	}, [receiverUID, uid]);

	return isCalling;
}
