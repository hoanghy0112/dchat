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

	return (
		<div className="w-screen h-screen bg-white flex flex-col">
			<div className=" flex-1 grid grid-cols-10">
				<div className=" col-span-3">
					<div
						className={`${font.className} font-medium text-2xl pt-8 pb-12 px-8`}
					>
						Hello, {displayName}
					</div>
					<div className=" flex flex-col m-5 mt-0 mr-10 ">{chatList}</div>
				</div>
				<div className=" col-span-7 lg:col-span-6 xl:col-span-5 ml-5 mr-5 py-5">
					{chatBox}
				</div>
			</div>
		</div>
	);
}
