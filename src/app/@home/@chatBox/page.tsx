import ChatBox from "@/components/ChatBox";

export default function Page({
	searchParams,
}: {
	searchParams?: { [key: string]: string | undefined };
}) {
	const receiverUID = searchParams?.uid;

	return (
		<div>
			<ChatBox receiverUID={receiverUID} />
		</div>
	);
}
