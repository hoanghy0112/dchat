"use client";

import useUser from "@/hooks/useUser";
import { FormEvent, ReactNode } from "react";

import useDB, { getDB } from "@/hooks/useDB";
import { signInWithGoogle } from "@/services/firebase/googleAuthentication";
import { setCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";

export default function Layout({ children }: { children: ReactNode }) {
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
	}

	return (
		<div className=" w-screen h-screen">
			<button onClick={onSignIn}>Sign in with Google</button>
			{children}
		</div>
	);
}
