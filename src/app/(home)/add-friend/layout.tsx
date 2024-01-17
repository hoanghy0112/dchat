import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: ReactNode }) {
	const uid = cookies().get(COOKIES.UID)?.value;
	if (!uid) redirect("/signin");

	return (
		<>
			<Toaster position="top-center" reverseOrder={false} />
			{children}
		</>
	);
}
