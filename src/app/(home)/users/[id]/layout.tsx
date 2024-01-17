import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({
	params: { id },
	children,
}: {
	params: { id: string };
	children: ReactNode;
}) {
	const uid = cookies().get(COOKIES.UID)?.value || "";
	if (id == uid) redirect("/profile");
	return children;
}
