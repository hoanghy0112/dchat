import UserProfilePage from "@/components/UserProfilePage";

export default function Page({ params: { id } }: { params: { id: string } }) {
	return <UserProfilePage uid={id} />;
}
