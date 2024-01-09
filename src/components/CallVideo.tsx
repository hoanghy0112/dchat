"use client";

import { COOKIES } from "@/constants/cookies";
import { VideoModalContext } from "@/contexts/VideoModalContext";
import useAnswer from "@/hooks/useAnswer";
import { getDB } from "@/hooks/useDB";
import peerConnection from "@/services/rtc/connection";
import { getCookie } from "cookies-next";
import { useContext, useEffect } from "react";
import { HiMiniVideoCamera } from "react-icons/hi2";
import Button from "./Button";
import { firestore } from "@/services/firebase";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";

export default function CallVideo({ receiverId, roomTitle }: PropTypes) {
	const uid = getCookie(COOKIES.UID);

	const { isOpen, onOpen } = useContext(VideoModalContext);

	const { isAnswer } = useAnswer();

	const onIceCandidate = async (event: RTCPeerConnectionIceEvent) => {
		console.log({ event });
		if (event.candidate) {
			await addDoc(
				collection(firestore, "calls", roomTitle, "offerCandidates"),
				event.candidate.toJSON()
			);
		}
		// getDB()
		// 	.get(`${roomTitle}`)
		// 	.get("offer-candidate")
		// 	.put({ ...event.candidate.toJSON(), isRead: false });
	};

	async function onOpenClicked() {
		onOpen();

		const callDoc = doc(firestore, "calls", roomTitle);

		// peerConnection?.addEventListener("icecandidate", onIceCandidate);

		// if (uid)
		// 	getDB()
		// 		.get(`${receiverId}-call`)
		// 		.get(uid)
		// 		.put({ uid, isCalling: true });

		// Create offer
		const offerDescription = await peerConnection?.createOffer();
		await peerConnection?.setLocalDescription(offerDescription);

		const offer = {
			sdp: offerDescription?.sdp,
			type: offerDescription?.type,
		};

		await setDoc(callDoc, { offer }, { merge: true });

		onSnapshot(callDoc, (snapshot) => {
			const data = snapshot.data();
			if (!peerConnection?.currentRemoteDescription && data?.answer) {
				const answerDescription = new RTCSessionDescription(data.answer);
				peerConnection?.setRemoteDescription(answerDescription);
			}
		});

		// When answered, add candidate to peer connection
		onSnapshot(
			query(collection(firestore, "calls", roomTitle, "answerCandidates")),
			{ includeMetadataChanges: true },
			(snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (change.type === "added") {
						const candidate = new RTCIceCandidate(change.doc.data());
						peerConnection?.addIceCandidate(candidate);
					}
				});
			}
		);

		// onSnapshot(
		// 	(snapshot) => {

		// 		if (data.metadata..type === "added") {
		// 			const candidate = new RTCIceCandidate(change.doc.data());
		// 			pc.addIceCandidate(candidate);
		// 		}
		// 	}
		// );

		// getDB().get(roomTitle).get("offer").put(offer);

		// getDB()
		// 	.get(roomTitle)
		// 	.get("answer")
		// 	.on((data) => {
		// 		if (!isAnswer) return;
		// 		console.log({ answer: data, offer });
		// 		if (!peerConnection?.currentRemoteDescription && data?.type) {
		// 			const answerDescription = new RTCSessionDescription(data);
		// 			peerConnection?.setRemoteDescription(answerDescription);
		// 		}
		// 	});

		// // When answered, add candidate to peer connection
		// getDB()
		// 	.get(roomTitle)
		// 	.get("answer-candidate")
		// 	.on((data) => {
		// 		console.log({ "answer-candidate": data });
		// 		if (!data.port || data.isRead) return;
		// 		getDB()
		// 			.get(roomTitle)
		// 			.get("answer-candidate")
		// 			.put({ ...data, isRead: true }, () => {
		// 				const candidate = new RTCIceCandidate(data);
		// 				peerConnection?.addIceCandidate(candidate);
		// 			});
		// 	});
	}

	useEffect(() => {
		console.log({ isOpen });
		peerConnection.addEventListener("icecandidate", onIceCandidate);

		if (!isOpen) {
			console.log("remove");
			if (uid)
				getDB()
					.get(`${receiverId}-call`)
					.get(uid)
					.put({ uid, isCalling: false });

			peerConnection.removeEventListener("icecandidate", onIceCandidate);
			getDB().get(roomTitle).get("answer-candidate").off();
			getDB().get(roomTitle).get("answer").off();
		}
	}, [isOpen]);

	return (
		<Button
			btnType={"secondary"}
			className=" h-fit py-2 text-secondary hover:bg-primary hover:text-white"
			onClick={onOpenClicked}
		>
			<HiMiniVideoCamera size={18} />
		</Button>
	);
}

type PropTypes = {
	receiverId: string;
	roomTitle: string;
};
