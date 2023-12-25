import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import IUser from "@/types/IUser";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function ChatItem({
	room: { id, title, users },
}: {
	room: IChatRoom;
}) {
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

	return (
		<li className=" flex flex-col gap-2 text-sm shadow-lg rounded-lg p-3 my-1 hover:bg-slate-100 active:bg-slate-200 duration-200 cursor-pointer">
            <p className=" font-medium">{user?.displayName}</p>
		</li>
	);
}
