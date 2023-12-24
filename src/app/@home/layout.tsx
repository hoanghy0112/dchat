import { COOKIES } from "@/constants/cookies";
import { getCookie } from "cookies-next";
import { Be_Vietnam_Pro } from "next/font/google";
import { cookies } from "next/headers";
import { ReactNode } from "react";

const font = Be_Vietnam_Pro({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function Page({
	chatBox,
	chatList,
}: {
	chatBox: ReactNode;
	chatList: ReactNode;
}) {
	const displayName = cookies().get(COOKIES.DISPLAY_NAME)?.value;
	console.log({ displayName });

	return (
		<div className="w-screen h-screen bg-white flex flex-col">
			<div className={`${font.className} font-medium text-2xl px-8 py-12`}>
				Hello, {displayName}
			</div>
			<div className=" flex-1 bg-red grid grid-cols-9">
				<div className=" flex flex-col col-span-2 m-5 ">{chatList}</div>
				<div className=" col-span-7">{chatBox}</div>
			</div>
		</div>
	);
}
