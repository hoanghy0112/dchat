"use client";

import useUser from "@/hooks/useUser";
import { FormEvent, ReactNode } from "react";

import useDB from "@/hooks/useDB";
import { signInWithGoogle } from "@/services/firebase/googleAuthentication";
import { setCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";

export default function Layout({ children }: { children: ReactNode }) {
	const user = useUser();
	const db = useDB();

	console.log({ db, user: db.user() });

	async function onSignIn(e: FormEvent) {
		e.preventDefault();

		const googleUser = await signInWithGoogle();
		const uid = googleUser.profile.uid;

		setCookie(COOKIES.ACCESS_TOKEN, googleUser.profile.getIdToken);
		setCookie(COOKIES.UID, googleUser.profile.uid);
		setCookie(COOKIES.DISPLAY_NAME, googleUser.profile.displayName);
		setCookie(COOKIES.EMAIL, googleUser.profile.email);

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
