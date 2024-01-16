import COLLECTIONS from "@/constants/collection";
import { useCollectionItem } from "@/hooks/useData";
import IUser from "@/types/IUser";
import Image from "next/image";

export default function InvitationUser({
	uid,
	state,
}: {
	uid: string;
	state: "pending" | "accept" | "reject";
}) {
	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, uid]);

	return user ? (
		<div className=" flex gap-2">
			<Image src={user.photo || ""} width={40} height={40} alt="" />
			<div>
				<p className=" font-semibold text-lg">{user.displayName}</p>
				{state == "pending" ? (
					<div className=" flex justify-evenly">
						<button>Accept</button>
						<button>Denied</button>
					</div>
				) : null}
			</div>
		</div>
	) : null;
}
