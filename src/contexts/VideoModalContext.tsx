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

const defaultValue: IVideoModalContext = {
	isOpen: false,
	onOpen: () => {},
	onClose: () => {},
};

export const VideoModalContext =
	createContext<IVideoModalContext>(defaultValue);

export function VideoModalProvider({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const uid = getCookie(COOKIES.UID) as string;

	const webcamVideo = useRef<HTMLVideoElement>(null);
	const remoteVideo = useRef<HTMLVideoElement>(null);

	const { isAnswer, roomTitle } = useAnswer();

	useEffect(() => {
		if (isAnswer) onOpen();
	}, [isAnswer]);

	useEffect(() => {
		// if (!isOpen) return;

		let localStream: MediaStream;
		let remoteStream: MediaStream;

		const onTrack = (event: RTCTrackEvent) => {
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
			// if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
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
		<VideoModalContext.Provider value={{ isOpen, onOpen, onClose }}>
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
	onOpen: () => any;
	onClose: () => any;
};
