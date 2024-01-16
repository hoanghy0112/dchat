"use client";

import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { addCollectionData } from "@/hooks/useData";
import { getCookie } from "cookies-next";

import UserCardInner from "@/components/UserCardInner";
import { UserStack } from "@/components/UserStack";
import FONT from "@/constants/fontFamily";
import useRecommendUser from "@/hooks/useRecommendUser";
import { IRequest } from "@/types/IUser";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa";

export default function Page() {
	const [sended, setSended] = useState<number>(0);

	const currentUID = getCookie(COOKIES.UID) || "";

	const users = useRecommendUser();

	const addRequest = useCallback((uid: string) => {
		const value: IRequest = {
			uid,
			date: new Date().toISOString(),
			state: "pending",
		};
		toast.success("Invitation is sent");
		setSended((prev: number) => prev + 1);
		// addCollectionData([COLLECTIONS.USERS, currentUID, COLLECTIONS.REQUESTS])(
		// 	value
		// );
	}, []);

	return (
		<div className=" relative w-screen h-screen flex flex-col">
			<div className=" mt-5 flex justify-between p-5">
				<div className=" flex flex-col gap-3">
					<h1 className={` font-bold text-xl ${FONT.primary.className}`}>
						Add more friends
					</h1>
					{/* <p className=" font-semibold">
						Total invitation: <span className=" font-semibold">5</span>
					</p> */}
				</div>
				{/* <div className=" py-2 px-2 h-fit rounded-md font-semibold active:bg-gray-200 duration-200">
					New friends
				</div> */}
			</div>
			<UserStack
				key={users.length}
				onVote={(item, vote) => vote && addRequest(item.props.user.uid)}
			>
				{users.map((user) => (
					<UserCardInner user={user} key={user.email} />
				))}
			</UserStack>
			<div className=" p-5 grid gap-3 place-items-center">
				<p className=" font-semibold">
					Sent invitation to <span>{sended}</span> users
				</p>
				<p className=" underline underline-offset-2 font-normal flex gap-2 items-center">
					View request list <FaArrowRight />
				</p>
			</div>
		</div>
	);
}
