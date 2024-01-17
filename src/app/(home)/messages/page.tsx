"use client";

import UserList from "@/components/UserList";
import UserSearch from "@/components/UserSearch";
import { COOKIES } from "@/constants/cookies";
import { getCookie } from "cookies-next";
import Image from "next/image";

export default function Page() {
	const photo = getCookie(COOKIES.PHOTO) || "";
	const displayName = getCookie(COOKIES.DISPLAY_NAME) || "";
	const email = getCookie(COOKIES.EMAIL) || "";

	return (
		<div className=" relative col-span-4 lg:col-span-3 h-full">
			<div className=" my-12 mt-5 flex justify-between items-start">
				<div className=" px-5 w-full flex items-center gap-3 ">
					{photo ? (
						<Image
							className=" rounded-full"
							src={photo}
							width={30}
							height={30}
							alt={""}
						/>
					) : null}
					<p className=" font-semibold text-xl">Chats</p>
					<UserSearch className=" ml-auto" />
				</div>
				<div className=" absolute right-0">{/* <LogoutButton /> */}</div>
			</div>
			<UserList className=" px-5" />
		</div>
	);
}
