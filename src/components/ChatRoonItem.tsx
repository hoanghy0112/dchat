import useReceiverProfile from "@/hooks/useReceiverProfile";
import IChatRoom from "@/types/IChatRoom";
import { useRouter } from "next/navigation";

export default function ChatItem({
	room: { id, title, users },
}: {
	room: IChatRoom;
}) {
	const router = useRouter();

	const { user, receiverUID } = useReceiverProfile({ users, id, title });

	return (
		<li
			onClick={() => {
				router.replace(`/?uid=${receiverUID}`);
			}}
			className=" flex flex-col gap-2 text-sm shadow-lg rounded-lg p-3 my-1 hover:bg-slate-100 active:bg-slate-200 duration-200 cursor-pointer"
		>
			<p className=" font-medium">{user?.displayName}</p>
		</li>
	);
}
