"use client";

import { COOKIES } from "@/constants/cookies";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import { CiLogout } from "react-icons/ci";

export default function LogoutButton() {
	const router = useRouter();

	function handleLogout() {
		deleteCookie(COOKIES.UID);
		deleteCookie(COOKIES.DISPLAY_NAME);
		deleteCookie(COOKIES.EMAIL);
		deleteCookie(COOKIES.PHOTO);
		router.replace("/");
	}

	return (
		<div
			onClick={() => handleLogout()}
			className=" cursor-pointer p-2 hover:bg-slate-100 active:bg-slate-200 duration-200 rounded-xl"
		>
			<CiLogout size={30} />
		</div>
	);
}
