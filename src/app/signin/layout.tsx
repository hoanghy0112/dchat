import { ReactNode } from "react";

import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
	const uid = cookies().get(COOKIES.UID)?.value || "";

	if (uid) redirect("/feeds");

	return children;
}
