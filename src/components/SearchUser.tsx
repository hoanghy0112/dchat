import COLLECTIONS from "@/constants/collection";
import { useCollectionItem } from "@/hooks/useData";
import IUser from "@/types/IUser";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SearchUser({
	uid,
	className,
	...props
}: { uid: string } & React.ComponentProps<"div">) {
	const router = useRouter();
	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, uid]);

	return user ? (
		<div
			{...props}
			className={` bg-white flex items-center gap-3 rounded-lg mb-1 p-3 hover:bg-gray-200 active:bg-gray-300 duration-200 ${className}`}
		>
			<Image
				className=" h-fit rounded-full"
				src={user.photo || ""}
				width={40}
				height={40}
				alt=""
			/>
			<div className=" flex flex-col gap-1">
				<p className=" font-semibold text-sm">{user.displayName}</p>
				<p className=" font-normal text-sm text-gray-700">
					{user.email}
				</p>
			</div>
		</div>
	) : null;
}
