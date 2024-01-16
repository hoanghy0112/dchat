import COLLECTIONS from "@/constants/collection";
import { useCollectionItem } from "@/hooks/useData";
import IUser from "@/types/IUser";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FriendUser({ uid }: { uid: string }) {
	const router = useRouter();
	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, uid]);

	return user ? (
		<div
			onClick={() => router.push(`/users/${uid}`)}
			className=" bg-white flex items-center gap-3 rounded-md mx-3 mb-1 p-3 shadow-md active:bg-gray-300 duration-200"
		>
			<Image
				className=" h-fit rounded-full"
				src={user.photo || ""}
				width={40}
				height={40}
				alt=""
			/>
			<p className=" font-semibold text-sm">{user.displayName}</p>
		</div>
	) : null;
}
