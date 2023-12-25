import { DB_KEYS } from "@/constants/dbKeys";
import IMessage from "@/types/IMessage";
import { useEffect, useState } from "react";
import { getDB } from "./useDB";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";
import { IGunChain, IGunInstance } from "gun";

export default function useChatMessages(receiverUID?: string) {
	const uid = getCookie(COOKIES.UID) as string;

	const [messages, setMessages] = useState<IMessage[]>([]);

	const roomTitle = [uid, receiverUID].sort().join("-");

	useEffect(() => {
		if (!receiverUID) return;

		const listener = getDB()
			.get(`${DB_KEYS.MESSAGES}-${roomTitle}`)
			.map()
			.once((data: IMessage, index) => {
				updateToList({ ...data, date: new Date(index) });
			});

		return () => {
			listener.off();
		};
	}, []);

	useEffect(() => {
		let getDetailListener: IGunChain<any>;
		const listener = getDB()
			.get(`${DB_KEYS.MESSAGES}-${roomTitle}`)
			.on((data) => {
				const index = Object.keys(data).at(-1);

				getDetailListener = getDB()
					.get(`${DB_KEYS.MESSAGES}-${roomTitle}`)
					.get(index || "")
					.once((data) => {
						updateToList({
							...data,
							date: index ? new Date(index) : null,
						});
					});
			});

		return () => {
			listener.off();
			getDetailListener?.off();
		};
	}, []);

	function updateToList(data: IMessage) {
		setMessages((prev) =>
			[
				...prev.filter((d) => d.date?.getTime() != data.date?.getTime()),
				data,
			].sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0))
		);
	}

	return messages;
}
