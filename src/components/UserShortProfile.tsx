// import { DB_KEYS } from "@/constants/dbKeys";
// import { getDB } from "@/hooks/useDB";
// import IUser from "@/types/IUser";
// import { useEffect, useState } from "react";

// export default function UserShortProfile({ uid }: { uid: string }) {
// 	const [user, setUser] = useState<IUser>();

// 	useEffect(() => {
// 		getDB()
// 			.get(DB_KEYS.USERS)
// 			.get(uid)
// 			.once((data: IUser) => {
// 				setUser(data);
// 			});
// 	}, []);

// 	return user ? (
// 		<div>
// 			<div
// 				className=" h-full flex justify-between px-2 py-3 rounded-md hover:bg-slate-400 active:bg-slate-200 transition-all duration-200 cursor-pointer"
// 				key={uid}
// 			>
// 				<Image
// 					className=" rounded-full"
// 					src={photo || ""}
// 					width={50}
// 					height={50}
// 					alt={""}
// 				/>
// 				<p className=" font-semibold">{displayName}</p>
// 			</div>
// 		</div>
// 	) : (
// 		<div>Loading...</div>
// 	);
// }
