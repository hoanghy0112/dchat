"use client";

import useUser from "@/hooks/useUser";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { FormEvent, ReactNode } from "react";
import chat from "../../assets/images/Chat.svg";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import { signInWithGoogle } from "@/services/firebase/googleAuthentication";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Page({ children }: { children: ReactNode }) {
	const router = useRouter();

	const user = useUser();
	const db = getDB();

	async function onSignIn(e: FormEvent) {
		e.preventDefault();

		const googleUser = await signInWithGoogle();
		const uid = googleUser.profile.uid;
		const displayName = googleUser.profile.displayName;
		const email = googleUser.profile.email;
		const photo = googleUser.profile.photoURL;

		setCookie(COOKIES.ACCESS_TOKEN, googleUser.profile.getIdToken);
		setCookie(COOKIES.UID, uid);
		setCookie(COOKIES.DISPLAY_NAME, displayName);
		setCookie(COOKIES.EMAIL, email);
		setCookie(COOKIES.PHOTO, photo);

		db.get(DB_KEYS.USERS).get(uid).put({
			uid,
			displayName,
			email,
			photo,
		});

		user.create(
			uid,
			uid,
			(res: { ok: number; pub: string } | { err: string }) => {
				user.auth(uid, uid);
			}
		);

		router.replace("/home");
	}

	return (
		<div className=" flex bg-background-100 w-screen h-screen items-center justify-around">
			<Image src={chat} alt="background" width={700} height={700} />
			<Button className=" text-white hover:bg-hovered bg-secondary" onClick={onSignIn}>
				Sign in with Google
			</Button>
			{children}
		</div>
	);
}