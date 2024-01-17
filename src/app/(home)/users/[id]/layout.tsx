import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Layout({ params: { id } }: { params: { id: string } }) {
	const uid = cookies().get(COOKIES.UID)?.value || "";
	if (id == uid) redirect("/profile");
}
