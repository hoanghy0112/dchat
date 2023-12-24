import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import useDB, { getDB } from "@/hooks/useDB";
import IChatRoom from "@/types/IChatRoom";
import { getCookie } from "cookies-next";

export default function Page() {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const chatRooms: IChatRoom[] = [];

	db.get(DB_KEYS.ROOMS)
		.map()
		.once((data: IChatRoom) => {
			if (data.users.includes(uid)) chatRooms.push(data);
		});

	return (
		<ul>
			{chatRooms.map(({ id, title, users }) => (
				<li key={id}>
					{title} - {users.join("; ")}
				</li>
			))}
		</ul>
	);
}
