import useReceiverProfile from "@/hooks/useReceiverProfile";
import IChatRoom from "@/types/IChatRoom";
import { useRouter } from "next/navigation";

import { HiChevronRight } from "react-icons/hi";

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
			className=" flex justify-between gap-2 text-sm rounded-lg p-3 my-1 hover:bg-slate-200 active:bg-slate-300 duration-200 cursor-pointer"
		>
			<p className=" font-semibold">{user?.displayName}</p>
			<HiChevronRight size={20} />
		</li>
	);
}
