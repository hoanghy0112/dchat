import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: ReactNode }) {

	return (
		<div className=" w-screen bg-white">
			<Toaster position="top-center" reverseOrder={false} />
			{children}
		</div>
	);
}
