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
import { useContext, useEffect, useRef, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { IoCall } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { MdCallEnd } from "react-icons/md";

export default function Page({
	params: { id: receiverUID },
}: {
	params: { id: string };
}) {
	const db = getDB();
	const uid = getCookie(COOKIES.UID) as string;

	const bottomRef = useRef<HTMLDivElement>(null);

	const [content, setContent] = useState("");

	const roomTitle = [uid, receiverUID].sort().join("-");

	const isCalling = useCalling(receiverUID);

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

	const listener = async (event: RTCPeerConnectionIceEvent) => {
		console.log({ event });
		event.candidate &&
			(await addDoc(
				collection(firestore, "calls", roomTitle, "answerCandidates"),
				{ ...event.candidate.toJSON(), time: new Date().getTime() }
			));
		// getDB()
		// 	.get(roomTitle)
		// 	.get("answer-candidate")
		// 	.put({ ...event.candidate.toJSON(), isRead: false });
	};

	// useEffect(() => {
	// 	peerConnection?.addEventListener("icecandidate", listener);

	// 	return () =>
	// 		peerConnection?.removeEventListener("icecandidate", listener);
	// }, [roomTitle]);

	async function onAnswer() {
		onOpen();
		const callDoc = doc(firestore, "calls", roomTitle);
		const callData = (await getDoc(callDoc)).data();
		console.log({ callData });

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
					console.log({ change });
					if (
						change.type === "added" &&
						change.doc.data().time &&
						new Date().getTime() - change.doc.data().time < 20 * 1000
					) {
						const data = change.doc.data();
						console.log({ offer: data });
						getPeerConnection().addIceCandidate(
							new RTCIceCandidate(data)
						);
					}
				});
			}
		);
		// let isAnswer = false;
		// let isAdd = false;
		// getDB().get(`${uid}-answer`).put({ uid, roomTitle, isAnswer: true });
		// getDB()
		// 	.get(roomTitle)
		// 	.get("offer")
		// 	.on(async (data) => {
		// 		if (isAnswer) return;
		// 		isAnswer = true;
		// 		const offerDescription = data;
		// 		await peerConnection?.setRemoteDescription(
		// 			new RTCSessionDescription(offerDescription)
		// 		);
		// 		const answerDescription = await peerConnection?.createAnswer();
		// 		await peerConnection?.setLocalDescription(answerDescription);
		// 		const answer = {
		// 			type: answerDescription?.type,
		// 			sdp: answerDescription?.sdp,
		// 		};
		// 		getDB()
		// 			.get(roomTitle)
		// 			.get("answer")
		// 			.put(answer, async () => {
		// 				getDB()
		// 					.get(roomTitle)
		// 					.get("offer-candidate")
		// 					.on((data) => {
		// 						if (data.isRead) return;
		// 						getDB().get(roomTitle).get("offer-candidate").off();
		// 						console.log({ "offer-candidate": data });
		// 						getDB()
		// 							.get(roomTitle)
		// 							.get("offer-candidate")
		// 							.put({ ...data, isRead: true }, () => {
		// 								isAdd = true;
		// 								peerConnection?.addIceCandidate(new RTCIceCandidate(data));
		// 							});
		// 					});
		// 			});
		// 	});
	}

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
						<div className=" h-fit pr-4">
							<CallVideo
								roomTitle={roomTitle}
								receiverId={receiverUID}
							/>
						</div>
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
					{true ? (
						<div className=" bg-white rounded-xl w-fit mx-auto my-5 p-5 flex justify-between items-center shadow-[-10px_-10px_60px_-20px_rgba(0,0,0,0.3),10px_10px_60px_-20px_rgba(0,0,0,0.3)]">
							<div className=" flex gap-3">
								<div
									onClick={(e) => {
										e.preventDefault();
										onAnswer();
									}}
									className=" flex gap-2 cursor-pointer rounded-full p-3 text-green-500 bg-white hover:bg-slate-100 active:bg-slate-200 duration-200"
								>
									Answer
									<IoCall className="" size={20} />
								</div>
								<div
									onClick={(e) => e.preventDefault()}
									className=" cursor-pointer rounded-full p-3  text-red-500 bg-white hover:bg-slate-100 active:bg-slate-200 duration-200"
								>
									<MdCallEnd size={20} />
								</div>
							</div>
						</div>
					) : null}
					<div className=" flex gap-5 px-3 w-full pt-4 pb-2">
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
