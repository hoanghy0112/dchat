"use client";

import { useRouter } from "next/navigation";

export default function FriendMenu({ active }: { active: string }) {
	const router = useRouter();
	return (
		<div className=" pl-3 flex">
			{["Invitation", "Friends", "Request"].map((title) => (
				<div
					key={title}
					className=" active:bg-slate-200 rounded-md duration-200 p-2"
					onClick={() => router.push(`/friends/${title.toLowerCase()}`)}
				>
					<p className=" font-semibold text-sm">{title}</p>
					{active == title ? (
						<div className=" rounded-full h-[2px] bg-sky-700 mx-3"></div>
					) : null}
				</div>
			))}
		</div>
	);
}
