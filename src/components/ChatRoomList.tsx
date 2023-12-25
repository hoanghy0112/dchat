import useChatRoomList from "@/hooks/useChatRoomList";
import ChatRoomItem from "./ChatRoonItem";

export default function ChatRoomList({
	receiverUID,
}: {
	receiverUID?: string;
}) {
	const chatRooms = useChatRoomList();

	return (
		<ul>
			{Array.from(chatRooms.values()).map((room) => (
				<ChatRoomItem key={room.id} room={room} />
			))}
		</ul>
	);
}
