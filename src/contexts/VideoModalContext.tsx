"use client";

import React, { ReactNode, createContext, useState } from "react";

import { COOKIES } from "@/constants/cookies";
import useAnswer from "@/hooks/useAnswer";
import { getDB } from "@/hooks/useDB";
import {
	Modal,
	ModalBody,
	ModalContent,
	useDisclosure,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { useEffect, useRef } from "react";
import getPeerConnection from "@/services/rtc/connection";
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	query,
	setDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";

const defaultValue: IVideoModalContext = {
	isOpen: false,
	isCalling: false,
	onOpen: () => {},
	onClose: () => {},
};

export const VideoModalContext =
	createContext<IVideoModalContext>(defaultValue);

export function VideoModalProvider({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const isCalling = useRef(false);
	const roomTitleRef = useRef("");
	const uid = getCookie(COOKIES.UID) as string;

	const webcamVideo = useRef<HTMLVideoElement>(null);
	const remoteVideo = useRef<HTMLVideoElement>(null);

	// const { isAnswer, roomTitle } = useAnswer();

	// useEffect(() => {
	// 	if (isAnswer) onOpen();
	// }, [isAnswer]);

	useEffect(() => {
		if (!isOpen) return;

		let localStream: MediaStream;
		let remoteStream: MediaStream;

		const onTrack = (event: RTCTrackEvent) => {
			console.log("track", event);
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
			if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
		};

		async function execute() {
			localStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			remoteStream = new MediaStream();

			localStream.getTracks().forEach((track) => {
				getPeerConnection().addTrack(track, localStream);
			});

			getPeerConnection().addEventListener("track", onTrack);

			if (webcamVideo.current) webcamVideo.current.srcObject = localStream;
			if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;

			console.log({ isCalling: isCalling.current, roomTitleRef });
			if (!isCalling.current || !roomTitleRef.current) return;

			const callDoc = doc(firestore, "calls", roomTitleRef.current);
			const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
				console.log({ event });
				if (event.candidate) {
					addDoc(
						collection(
							firestore,
							"calls",
							roomTitleRef.current,
							"offerCandidates"
						),
						{
							...event.candidate.toJSON(),
							time: new Date().getTime(),
						}
					);
				}
			};
			getPeerConnection().onicecandidate = onIceCandidate;
			console.log({ pc: getPeerConnection() });

			// Create offer
			const offerDescription = await getPeerConnection().createOffer();
			await getPeerConnection().setLocalDescription(offerDescription);

			const offer = {
				sdp: offerDescription?.sdp,
				type: offerDescription?.type,
			};

			await setDoc(callDoc, { offer }, { merge: false });

			onSnapshot(callDoc, (snapshot) => {
				const data = snapshot.data();
				if (!getPeerConnection().currentRemoteDescription && data?.answer) {
					const answerDescription = new RTCSessionDescription(data.answer);
					console.log({ answerDescription });
					getPeerConnection().setRemoteDescription(answerDescription);
				}
			});

			// When answered, add candidate to peer connection
			onSnapshot(
				query(
					collection(
						firestore,
						"calls",
						roomTitleRef.current,
						"answerCandidates"
					)
				),
				{ includeMetadataChanges: true },
				(snapshot) => {
					snapshot.docChanges().forEach((change) => {
						if (
							change.type === "added" &&
							change.doc.data().time &&
							new Date().getTime() - change.doc.data().time < 20 * 1000
						) {
							const data = change.doc.data();
							console.log({ answer: data });
							const candidate = new RTCIceCandidate(data);
							getPeerConnection().addIceCandidate(candidate);
						}
					});
				}
			);
		}

		execute();

		return () => {
			// localStream.getTracks().forEach(function (track) {
			// 	track.stop();
			// });
			// getPeerConnection().removeEventListener("track", onTrack);
			// if (roomTitle) getDB().get(roomTitle).get("answer").put(null);
		};
	}, [isOpen]);

	return (
		<VideoModalContext.Provider
			value={{
				isOpen,
				onOpen: (calling = false, roomTitle = "") => {
					onOpen();
					isCalling.current = calling;
					roomTitleRef.current = roomTitle;
				},
				onClose,
				isCalling: isCalling?.current || false,
			}}
		>
			{children}
			<Modal
				className="h-full"
				backdrop="blur"
				size="5xl"
				isOpen={isOpen}
				onOpenChange={(e) => {
					onOpenChange();
					if (!e) {
						getDB().get(`${uid}-answer`).put({ uid, isAnswer: false });
					}
				}}
				scrollBehavior={"inside"}
			>
				<div className=" rounded-xl p-5"></div>

				<ModalContent>
					{(onClose) => (
						<>
							<ModalBody className=" flex">
								<div className=" relative -my-2 -mx-6 flex-1 rounded-xl overflow-hidden">
									<video
										ref={remoteVideo}
										className=" w-full h-full object-cover"
										autoPlay
										playsInline
									></video>
									<video
										ref={webcamVideo}
										className=" z-50 absolute top-10 right-10 w-40 h-40 object-cover rounded-2xl overflow-hidden"
										autoPlay
										playsInline
									></video>
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</VideoModalContext.Provider>
	);
}

type IVideoModalContext = {
	isOpen: boolean;
	isCalling: boolean;
	onOpen: (v?: boolean, r?: string) => any;
	onClose: () => any;
};
