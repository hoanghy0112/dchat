import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { FaRegCompass } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { LuMessageSquare } from "react-icons/lu";
import { MdPeopleOutline } from "react-icons/md";

const ROUTES = [
	{
		icon: <IoHomeOutline size={18} />,
		title: "Feeds",
		link: "/feeds",
	},
	{
		icon: <FaRegCompass size={18} />,
		title: "Explore",
		link: "/add-friend",
	},
	{
		icon: <LuMessageSquare size={18} />,
		title: "Message",
		link: "/messages",
	},
	{
		icon: <MdPeopleOutline size={20} />,
		title: "Friends",
		link: "/friends",
	},
];

export default function Layout({ children }: { children: ReactNode }) {
	const uid = cookies().get(COOKIES.UID)?.value;
	if (!uid) redirect("/signin");

	return (
		<div className=" w-screen h-screen flex flex-col">
			<div className=" flex-1 overflow-y-auto ">
				{children}
			</div>
			<div className=" pb-1 pt-3 flex-none w-full bg-white shadow-2xl flex items-center justify-evenly">
				{ROUTES.map(({ icon, title, link }) => (
					<Link
						href={link}
						className=" p-2 flex flex-col items-center rounded-lg gap-[5px] active:bg-slate-100 duration-200"
					>
						{icon}
						<p className=" text-xs">{title}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
