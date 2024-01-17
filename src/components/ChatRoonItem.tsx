import useCalling from "@/hooks/useCalling";
import useReceiverProfile from "@/hooks/useReceiverProfile";
import IChatRoom from "@/types/IChatRoom";
import { useRouter } from "next/navigation";

import { HiChevronRight } from "react-icons/hi";
import { IoCall } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";

export default function ChatItem({
	room: { id, title, users },
}: {
	room: IChatRoom;
}) {
	const router = useRouter();

	const { user, receiverUID } = useReceiverProfile({ users, id, title });

	const isCalling = useCalling(receiverUID);

	return (
		<li
			onClick={() => {
				router.replace(`/messages/${receiverUID}`);
			}}
			className=" flex items-center justify-between gap-2 text-sm rounded-lg p-3 my-1 hover:bg-slate-200 active:bg-slate-300 duration-200 cursor-pointer"
		>
			<p className=" font-semibold">{user?.displayName}</p>
			{isCalling ? (
				<div className=" flex gap-3">
					<div
						onClick={(e) => e.preventDefault()}
						className="motion-safe:animate-bounce rounded-full p-3 text-white bg-green-500 hover:bg-green-600 active:bg-green-700 duration-200"
					>
						<IoCall className="" size={15} />
					</div>
					<div
						onClick={(e) => e.preventDefault()}
						className=" rounded-full p-3 text-white bg-red-500 hover:bg-red-600 active:bg-red-700 duration-200"
					>
						<MdCallEnd size={15} />
					</div>
				</div>
			) : (
				<HiChevronRight size={20} />
			)}
		</li>
	);
}
