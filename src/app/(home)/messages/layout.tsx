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

const font = Be_Vietnam_Pro({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function Page({ children }: { children: ReactNode }) {
	return (
		<VideoModalProvider>
			<div className="w-screen h-full flex-col overflow-hidden sm:grid sm:grid-cols-10 bg-white">
				{children}
			</div>
		</VideoModalProvider>
	);
}
