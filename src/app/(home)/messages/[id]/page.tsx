"use client";

import CallVideo from "@/components/CallVideo";
import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { VideoModalContext } from "@/contexts/VideoModalContext";
import useCalling from "@/hooks/useCalling";
import useChatMessages from "@/hooks/useChatMessages";
import useChatRoomProfile from "@/hooks/useChatRoomProfile";
import { getDB } from "@/hooks/useDB";
import { useReceiverProfileFromID } from "@/hooks/useReceiverProfile";
import { firestore } from "@/services/firebase";
import getPeerConnection from "@/services/rtc/connection";
import IMessage from "@/types/IMessage";
import { Button, Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { HiOutlineChevronRight } from "react-icons/hi";
import { IoCall } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { MdCallEnd } from "react-icons/md";

import { useRouter } from "next/navigation";

export default function Page({
	params: { id: receiverUID },
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const bottomRef = useRef<HTMLDivElement>(null);

	const [content, setContent] = useState("");

	const roomTitle = [uid, receiverUID].sort().join("-");

	const [isCalling, otherUID] = useCalling(receiverUID);

	const { user } = useReceiverProfileFromID(receiverUID);
	const { room, roomId } = useChatRoomProfile(receiverUID || "");

	const messages = useChatMessages(receiverUID);

	const { onOpen } = useContext(VideoModalContext);

	function autoScroll(behavior: ScrollBehavior = "smooth") {
		setTimeout(() => bottomRef?.current?.scrollIntoView({ behavior }), 200);
	}

	function sendMessage() {
		if (!content) return;
		setContent("");

		const message = {
			content,
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

	const listener = useCallback(
		async (event: RTCPeerConnectionIceEvent) => {
			console.log({ event });
			event.candidate &&
				(await addDoc(
					collection(firestore, "calls", roomTitle, "answerCandidates"),
					{ ...event.candidate.toJSON(), time: new Date().getTime() }
				));
		},
		[roomTitle]
	);

	async function onAnswer() {
		const roomTitle = [uid, otherUID].sort().join("-");

		onOpen(false);
		const callDoc = doc(firestore, "calls", roomTitle);
		const callData = (await getDoc(callDoc)).data();

		getDB().get(`${uid}-answer`).put({ uid, roomTitle, isAnswer: true });

		if (!callData) return;

		getPeerConnection().addEventListener("icecandidate", listener);

		const offerDescription = callData.offer;
		await getPeerConnection().setRemoteDescription(
			new RTCSessionDescription(offerDescription)
		);

		const answerDescription = await getPeerConnection().createAnswer();
		await getPeerConnection().setLocalDescription(answerDescription);

		const answer = {
			type: answerDescription.type,
			sdp: answerDescription.sdp,
		};

		await setDoc(callDoc, { answer }, { merge: true });

		onSnapshot(
			collection(firestore, "calls", roomTitle, "offerCandidates"),
			(snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (
						change.type === "added" &&
						change.doc.data().time &&
						new Date().getTime() - change.doc.data().time < 20 * 1000
					) {
						const data = change.doc.data();
						getPeerConnection().addIceCandidate(
							new RTCIceCandidate(data)
						);
					}
				});
			}
		);
	}

	return (
		<div className=" flex-1 h-full flex flex-col overflow-auto">
			{user ? (
				<>
					<div className=" w-full px-5 py-2 flex justify-between shadow-lg">
						<div className=" flex gap-2 items-center">
							<FaChevronLeft
								onClick={() => router.push("/messages")}
								className="p-2 -ml-3 -mr-3 rounded-full active:bg-slate-200 duration-200"
								size={33}
							/>
							<div
								onClick={() => router.push(`/users/${receiverUID}`)}
								className=" flex gap-2 py-2 px-3 items-center rounded-lg active:bg-slate-200 duration-200"
							>
								{user.photo && (
									<Image
										className=" rounded-full"
										src={user.photo}
										width={30}
										height={30}
										alt={""}
									/>
								)}
								<div className=" flex flex-col">
									<p className=" text-sm font-semibold">
										{user.displayName}
									</p>
								</div>
							</div>
						</div>
						<div className=" h-fit pr-0">
							<CallVideo
								roomTitle={roomTitle}
								receiverId={receiverUID}
							/>
						</div>
					</div>
					<div className=" w-full border-t-1 mt-0 pt-3 pr-3 flex-1 overflow-auto">
						{messages.map((data: IMessage, index: number) => (
							<div
								key={index}
								className={` w-full my-2 flex ${
									data.uid == uid
										? " justify-end pl-20"
										: " justify-start pr-20"
								}`}
							>
								<p className=" text-sm w-fit bg-slate-300 px-3 py-2 rounded-xl hover:bg-slate-200 duration-200 cursor-pointer">
									{data.content || "No content"}
								</p>
							</div>
						))}
						<div ref={bottomRef} />
					</div>
					{isCalling ? (
						<div className=" bg-slate-300 rounded-full w-fit mx-auto my-2 p-2 flex justify-between items-center shadow-[-10px_-10px_60px_-20px_rgba(0,0,0,0.3),10px_10px_60px_-20px_rgba(0,0,0,0.3)]">
							<div className=" flex gap-3">
								<div
									onClick={(e) => {
										e.preventDefault();
										onAnswer();
									}}
									className=" flex gap-2 cursor-pointer rounded-full p-3 text-primary bg-slate-200 hover:bg-slate-100 active:bg-slate-200 duration-200"
								>
									Answer
									<IoCall className="" size={20} />
								</div>
								<div
									onClick={(e) => e.preventDefault()}
									className=" cursor-pointer rounded-full py-3 px-4 text-white bg-secondary hover:text-secondary hover:bg-slate-100 active:bg-slate-200 duration-200"
								>
									<MdCallEnd size={20} />
								</div>
							</div>
						</div>
					) : null}
					<div className=" flex gap-5 mobile:max-sm:px-1 px-3 w-full pt-4 pb-2">
						<Input
							value={content}
							onChange={(e) => setContent(e.target.value)}
							type="text"
							label=""
							labelPlacement={"outside"}
							startContent={<HiOutlineChevronRight size={20} />}
							onKeyDown={(e) => {
								if (e.key === "Enter") sendMessage();
							}}
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
