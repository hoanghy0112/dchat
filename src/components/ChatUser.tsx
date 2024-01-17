"use client";

import COLLECTIONS from "@/constants/collection";
import { useCollectionItem } from "@/hooks/useData";
import IUser from "@/types/IUser";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChatUser({ uid }: { uid: string }) {
	const router = useRouter();
	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, uid]);

	return user ? (
		<div
			onClick={() => router.push(`/messages/${uid}`)}
			className=" bg-white flex items-center gap-3 rounded-none -mx-5 mb-1 px-5 py-3 active:bg-gray-200 duration-200"
		>
			<Image
				onClick={() => router.push(`/users/${uid}`)}
				className=" h-fit rounded-full"
				src={user.photo || ""}
				width={40}
				height={40}
				alt=""
			/>
			<div className=" flex flex-col justify-evenly gap-2 ">
				<p className=" font-semibold text-sm">{user.displayName}</p>
				<p></p>
			</div>
		</div>
	) : null;
}
