"use client";

import useChatRoomList from "@/hooks/useChatRoomList";
import ChatRoomItem from "./ChatRoonItem";

export default function ChatRoomList() {
	const chatRooms = useChatRoomList();

	return (
		<ul className=" bg-slate-100 rounded-lg">
			{Array.from(chatRooms.values()).map((room) => (
				<ChatRoomItem key={room.id} room={room} />
			))}
		</ul>
	);
}
