"use client";

import { COOKIES } from "@/constants/cookies";
import { auth } from "@/services/firebase/googleAuthentication";
import { setCookie } from "cookies-next";
import { onAuthStateChanged } from "firebase/auth";

export default function Authentication() {
	onAuthStateChanged(auth, (googleUser) => {
		if (googleUser) {
			const uid = googleUser.uid;
			const displayName = googleUser.displayName;
			const email = googleUser.email;
			const photo = googleUser.photoURL;

			setCookie(COOKIES.ACCESS_TOKEN, googleUser.getIdToken);
			setCookie(COOKIES.UID, uid);
			setCookie(COOKIES.DISPLAY_NAME, displayName);
			setCookie(COOKIES.EMAIL, email);
			setCookie(COOKIES.PHOTO, photo);
		} else {
		}
	});
	return <></>;
}
