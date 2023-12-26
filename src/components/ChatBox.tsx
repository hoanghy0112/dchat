"use client";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import useChatMessages from "@/hooks/useChatMessages";
import useChatRoomProfile from "@/hooks/useChatRoomProfile";
import { getDB } from "@/hooks/useDB";
import { useReceiverProfileFromID } from "@/hooks/useReceiverProfile";
import IMessage from "@/types/IMessage";
import { Button, Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { HiOutlineChevronRight, HiSearch } from "react-icons/hi";
import { LuSendHorizonal } from "react-icons/lu";

export default function ChatBox({ receiverUID }: { receiverUID?: string }) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const inputRef = useRef<HTMLInputElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	const roomTitle = [uid, receiverUID].sort().join("-");

	const { user } = useReceiverProfileFromID(receiverUID);
	const { room, roomId } = useChatRoomProfile(receiverUID || "");

	const messages = useChatMessages(receiverUID);

	function autoScroll(behavior: ScrollBehavior = "smooth") {
		setTimeout(() => bottomRef?.current?.scrollIntoView({ behavior }), 200);
	}

	function sendMessage() {
		if (!inputRef?.current?.value) return;

		const message = {
			content: inputRef.current.value,
			roomID: roomId,
			uid,
		} as IMessage;

		const index = new Date().toISOString();

		const doc = db
			.get(`${DB_KEYS.MESSAGES}-${roomTitle}`)
			.get(index)
			.put(message);
	}

	useEffect(() => {
		if (!receiverUID) return;
		const newRoom = db
			.get(roomTitle)
			.get(DB_KEYS.ROOM_INFO)
			.put({
				id: roomTitle,
				users: [uid, receiverUID].sort().join(","),
			});
		db.get(DB_KEYS.ROOMS).get(roomTitle).get(DB_KEYS.ROOM_INFO).set(newRoom);
		autoScroll();
	}, [receiverUID, roomTitle, uid]);

	useEffect(() => {
		autoScroll("auto");
	}, [messages.length]);

	return (
		<div className=" h-full flex flex-col overflow-auto">
			{user ? (
				<>
					<div className=" w-full flex justify-between">
						<div className=" flex gap-3 items-center">
							{user.photo && (
								<Image
									className=" rounded-full"
									src={user.photo}
									width={50}
									height={50}
									alt={""}
								/>
							)}
							<div className=" flex flex-col">
								<p className=" font-medium">{user.displayName}</p>
								<p className=" text-zinc-700">{user.email}</p>
							</div>
						</div>
						<div></div>
					</div>
					<div className=" w-full mt-5 pr-3 flex-1 overflow-auto">
						{messages.map((data: IMessage, index: number) => (
							<div
								key={index}
								className={` w-full my-2 flex ${
									data.uid == uid
										? " justify-end pl-20"
										: " justify-start pr-20"
								}`}
							>
								<p className=" w-fit bg-slate-100 px-3 py-2 rounded-md hover:bg-slate-200 duration-200 cursor-pointer">
									{data.content || "No content"}
								</p>
							</div>
						))}
						<div ref={bottomRef} />
					</div>
					<div className=" flex gap-5 px-3 w-full pt-4 pb-2">
						<Input
							ref={inputRef}
							type="text"
							label=""
							labelPlacement={"outside"}
							startContent={<HiOutlineChevronRight size={20} />}
							// onClear={() => inputRef.current}
						/>
						<Button
							isIconOnly
							variant="light"
							onPress={() => sendMessage()}
						>
							<LuSendHorizonal size={20} />
						</Button>
					</div>
				</>
			) : null}
		</div>
	);
}
