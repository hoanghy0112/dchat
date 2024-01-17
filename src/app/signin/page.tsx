"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import { FormEvent } from "react";
import { FaFacebookF } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import chat from "../../assets/images/Chat.svg";
import bgImage from "../../assets/images/bgImage.svg";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { getDB } from "@/hooks/useDB";
import { signInWithGoogle } from "@/services/firebase/googleAuthentication";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();

	// const user = useUser();
	const db = getDB();

	async function onSignIn(e: FormEvent) {
		e.preventDefault();

		const googleUser = await signInWithGoogle();
		console.log({ googleUser });
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

		// user.create(
		// 	uid,
		// 	uid,
		// 	(res: { ok: number; pub: string } | { err: string }) => {
		// 		user.auth(uid, uid);
		// 	}
		// );

		router.replace("/feeds");
	}

	return (
		<div className=" flex w-screen bg-background-100 h-screen items-center md:justify-around justify-start">
			<Image src={chat} alt="background" width={700} height={700} />
			<div className=" flex flex-col relative  mobile:max-md:absolute mobile:max-md:items-center mobile:max-md:w-full mobile:max-md:h-full">
				<Image
					src={bgImage}
					alt="login"
					width={300}
					height={300}
					className=" shadow-lg shadow-white rounded-5"
				/>
				<div className=" flex flex-col absolute items-center justify-center w-full h-full pt-56">
					<Button
						className=" text-[#EA4335] hover:!bg-[#EA4335] bg-white m-3"
						color="danger"
						variant="ghost"
						onClick={onSignIn}
					>
						<SiGmail className=" w-5 h-5" />
						Sign in with Google
					</Button>
					<Button
						className=" text-[#0866FF] hover:!bg-[#0866FF] bg-white m-3"
						color="primary"
						variant="ghost"
						onClick={onSignIn}
					>
						<FaFacebookF className=" w-5 h-5" />
						Sign in with Facebook
					</Button>
				</div>
			</div>
		</div>
	);
}
