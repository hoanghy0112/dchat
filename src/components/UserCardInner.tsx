import IUser from "@/types/IUser";
import Image from "next/image";

export default function UserCardInner({
	user: { email, displayName, photo, uid },
}: {
	user: IUser;
}) {
	return (
		<div
			key={email}
			className=" bg-white overflow-hidden w-[250px] h-[350px] flex flex-col items-center justify-center font-semibold text-xl shadow-lg rounded-lg"
			data-value="waffles"
		>
			<div className=" flex-1"></div>
			<div className=" w-full px-3 py-3 flex flex-initial gap-3">
				<Image
					className=" w-10 h-10 rounded-full flex-initial"
					src={photo || ""}
					width={40}
					height={40}
					alt={""}
				/>
				<div>
					<p className=" font-semibold text-sm">{displayName}</p>
					<p className=" text-xs font-normal text-zinc-700">{email}</p>
				</div>
			</div>
		</div>
	);
}
