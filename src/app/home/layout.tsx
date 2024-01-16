import ChatRoomList from "@/components/ChatRoomList";
import LogoutButton from "@/components/LogoutButton";
import UserList from "@/components/UserList";
import UserSearch from "@/components/UserSearch";
import { COOKIES } from "@/constants/cookies";
import { VideoModalProvider } from "@/contexts/VideoModalContext";
import { Be_Vietnam_Pro } from "next/font/google";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const font = Be_Vietnam_Pro({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function Page({ children }: { children: ReactNode }) {
	const photo = cookies().get(COOKIES.PHOTO)?.value || "";
	const displayName = cookies().get(COOKIES.DISPLAY_NAME)?.value || "";
	const email = cookies().get(COOKIES.EMAIL)?.value || "";

	const uid = cookies().get(COOKIES.UID)?.value || "";
	if (!uid) redirect("/signin");

	return (
		<VideoModalProvider>
			<div className="w-screen h-screen grid grid-cols-10 bg-white">
				<div className=" relative col-span-4 lg:col-span-3 h-full mr-10">
					<div className="  mx-8 my-12 mt-5 flex justify-between items-start">
						<div className=" flex flex-col items-start gap-5 ">
							{photo ? (
								<Image
									className=" rounded-full"
									src={photo}
									width={50}
									height={50}
									alt={""}
								/>
							) : null}
							<div className=" flex flex-col">
								<p className={` font-medium ${font.className}`}>
									{displayName}
								</p>
								<p
									className={` text-zinc-700 text-sm ${font.className}`}
								>
									{email}
								</p>
							</div>
						</div>
						<div className=" absolute right-0">
							<LogoutButton />
						</div>
					</div>
					<div className=" flex flex-col m-5 mt-0 mr-0 ">
						<div className=" flex-1">
							{/* <ChatRoomList /> */}
							<UserSearch className=" mb-5" />
							<UserList />
						</div>
					</div>
				</div>
				<div className=" h-screen col-span-6 lg:col-span-6 xl:col-span-5 ml-5 mr-5 py-5">
					{children}
				</div>
			</div>
		</VideoModalProvider>
	);
}
