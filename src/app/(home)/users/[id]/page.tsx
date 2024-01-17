import UserProfilePage from "@/components/UserProfilePage";
import { getCookie } from "cookies-next";

export default function Page({ params: { id } }: { params: { id: string } }) {
	return <UserProfilePage uid={id} />;
}
