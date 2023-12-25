import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import IUser from "@/types/IUser";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function useReceiverProfile({ users, id }: IChatRoom) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const [user, setUser] = useState<IUser>();

	const receiverUID = users?.split(",").find((id) => id != uid) || "";

	useEffect(() => {
		db.get(DB_KEYS.USERS)
			.get(receiverUID)
			.once((data: IUser) => {
				setUser(data);
			});
	}, []);

	return { user, receiverUID };
}

export function useReceiverProfileFromID(receiverUID?: string) {
	const db = getDB();

	const [user, setUser] = useState<IUser>();

	useEffect(() => {
        if (!receiverUID) return;
		db.get(DB_KEYS.USERS)
			.get(receiverUID)
			.once((data: IUser) => {
				setUser(data);
			});
	}, []);

	return { user, receiverUID };
}
