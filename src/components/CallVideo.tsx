"use client";

import { COOKIES } from "@/constants/cookies";
import { VideoModalContext } from "@/contexts/VideoModalContext";
import useAnswer from "@/hooks/useAnswer";
import { firestore } from "@/services/firebase";
import getPeerConnection from "@/services/rtc/connection";
import { getCookie } from "cookies-next";
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	query,
	setDoc,
} from "firebase/firestore";
import { useContext, useEffect } from "react";
import { HiMiniVideoCamera } from "react-icons/hi2";
import Button from "./Button";
import { getDB } from "@/hooks/useDB";

export default function CallVideo({ receiverId, roomTitle }: PropTypes) {
	const uid = getCookie(COOKIES.UID);

	const { isOpen, onOpen } = useContext(VideoModalContext);

	const { isAnswer } = useAnswer();

	const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
		console.log({ event });
		if (event.candidate) {
			addDoc(collection(firestore, "calls", roomTitle, "offerCandidates"), {
				...event.candidate.toJSON(),
				time: new Date().getTime(),
			});
		}
	};

	async function onOpenClicked() {
		onOpen(true, roomTitle);
		// getPeerConnection().addTrack(new MediaStreamTrack(), new MediaStream());

		if (uid)
			getDB()
				.get(`${receiverId}-call`)
				.get(uid)
				.put({ uid, time: new Date().getTime() });

		// getPeerConnection().addEventListener("icecandidate", onIceCandidate);

		// const callDoc = doc(firestore, "calls", roomTitle);
		// getPeerConnection().onicecandidate = onIceCandidate;
		// console.log({ pc: getPeerConnection() });

		// // Create offer
		// const offerDescription = await getPeerConnection().createOffer();
		// await getPeerConnection().setLocalDescription(offerDescription);

		// const offer = {
		// 	sdp: offerDescription?.sdp,
		// 	type: offerDescription?.type,
		// };

		// await setDoc(callDoc, { offer }, { merge: false });

		// onSnapshot(callDoc, (snapshot) => {
		// 	const data = snapshot.data();
		// 	if (!getPeerConnection().currentRemoteDescription && data?.answer) {
		// 		const answerDescription = new RTCSessionDescription(data.answer);
		// 		console.log({ answerDescription });
		// 		getPeerConnection().setRemoteDescription(answerDescription);
		// 	}
		// });

		// // When answered, add candidate to peer connection
		// onSnapshot(
		// 	query(collection(firestore, "calls", roomTitle, "answerCandidates")),
		// 	{ includeMetadataChanges: true },
		// 	(snapshot) => {
		// 		snapshot.docChanges().forEach((change) => {
		// 			if (
		// 				change.type === "added" &&
		// 				change.doc.data().time &&
		// 				new Date().getTime() - change.doc.data().time < 20 * 1000
		// 			) {
		// 				const data = change.doc.data();
		// 				console.log({ answer: data });
		// 				const candidate = new RTCIceCandidate(data);
		// 				getPeerConnection().addIceCandidate(candidate);
		// 			}
		// 		});
		// 	}
		// );

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
		// 		if (!getPeerConnection()?.currentRemoteDescription && data?.type) {
		// 			const answerDescription = new RTCSessionDescription(data);
		// 			getPeerConnection()?.setRemoteDescription(answerDescription);
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
		// 				getPeerConnection()?.addIceCandidate(candidate);
		// 			});
		// 	});
	}

	// useEffect(() => {
	// 	console.log({ isOpen });
	// 	getPeerConnection().addEventListener("icecandidate", onIceCandidate);

	// 	if (!isOpen) {
	// 		console.log("remove");
	// 		if (uid)
	// 			getDB()
	// 				.get(`${receiverId}-call`)
	// 				.get(uid)
	// 				.put({ uid, isCalling: false });

	// 		getPeerConnection().removeEventListener("icecandidate", onIceCandidate);
	// 		getDB().get(roomTitle).get("answer-candidate").off();
	// 		getDB().get(roomTitle).get("answer").off();
	// 	}
	// }, [isOpen]);

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
