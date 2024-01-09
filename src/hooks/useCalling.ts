import { COOKIES } from "@/constants/cookies";
import { getDB } from "@/hooks/useDB";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function useCalling(receiverUID: string) {
	const uid = getCookie(COOKIES.UID) as string;

	const [isCalling, setIsCalling] = useState(false);
	const [otherUID, setOtherUID] = useState("");

	useEffect(() => {
		if (!uid) return;

		// console.log({ state: peerConnection?.signalingState });

		let isCall = false;

		getDB()
			.get(`${uid}-call`)
			.map()
			.on((data: { uid: string; time: number }) => {
				if (!data?.uid) return;
				if (new Date().getTime() - data.time < 20 * 1000) {
					setIsCalling(true);
					setOtherUID(data.uid);
				}
			});

		if (!isCall) setIsCalling(false);

		return () => {
			getDB().get(`${uid}-call`).get(receiverUID).off();
		};
	}, [uid]);

	return [isCalling, otherUID];
}
