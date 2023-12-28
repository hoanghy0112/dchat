import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
	const uid = cookies().get(COOKIES.UID)?.value || "";
	if (!uid) redirect("/signin");
	// else redirect("/home");
}
