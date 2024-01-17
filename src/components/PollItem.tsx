"use client";

import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import {
	addCollectionData,
	useCollectionItem,
	useCollectionList,
} from "@/hooks/useData";
import { IPoll, IVote } from "@/types/IFeed";
import IUser from "@/types/IUser";
import { Button, Checkbox, cn } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FcComboChart } from "react-icons/fc";

export default function PollItem({ poll }: { poll?: IPoll }) {
	const uid = getCookie(COOKIES.UID) || "";

	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, poll?.uid || ""]);
	const { data: votes } = useCollectionList<IVote>([
		COLLECTIONS.POLLS,
		poll?.date || "",
		COLLECTIONS.VOTES,
	]);

	const [voteInfo, setVoteInfo] = useState<string>();
	const selectRef = useRef<boolean[]>(
		poll?.choices.split("_").map(() => false) || []
	);

	useEffect(() => {
		setVoteInfo("");
		votes.forEach((vote) => {
			if (vote.uid == uid) {
				setVoteInfo(vote.date);
				selectRef.current = vote.choices.split("_").map((v) => v == "true");
			}
		});
	}, [votes, uid]);

	const onSubmit = useCallback(() => {
		const date = new Date().toISOString();
		setVoteInfo(date);
		const value: IVote = {
			uid,
			date,
			choices: selectRef.current.join("_"),
		};

		if (voteInfo) {
			addCollectionData([
				COLLECTIONS.POLLS,
				poll?.date || "",
				COLLECTIONS.VOTES,
				voteInfo,
			])(value);
		} else
			addCollectionData([
				COLLECTIONS.POLLS,
				poll?.date || "",
				COLLECTIONS.VOTES,
			])(value);
	}, [selectRef, voteInfo, uid]);

	return poll && poll.uid != uid && voteInfo != undefined ? (
		<div className=" flex flex-col items-start gap-0 bg-white py-5">
			<p className=" ml-5 mb-4 text-xs text-slate-600">
				{voteInfo
					? "You have responsed the poll from"
					: "You have a poll from "}
				<span className=" ml-0 p-2 rounded-md hover:bg-slate-100 active:bg-slate-200 duration-200">
					<Image
						className=" inline-block w-fit h-fit rounded-full"
						src={user?.photo || ""}
						width={15}
						height={15}
						alt=""
					/>
					<span className=" ml-1 font-medium text-slate-950">
						{user?.displayName}
					</span>
				</span>
			</p>
			<p className=" ml-5 text-center mx-20 w-fit min-w-[100px] text-xl outline-none border-b-0">
				{poll.question}
			</p>
			<div className=" w-full px-4 mt-2 flex flex-col gap-1">
				{poll.choices.split("_").map((value, id) => (
					<div
						key={id}
						className=" w-full flex gap-1 p-2 rounded-lg border-0 "
					>
						<Checkbox
							isSelected={selectRef.current[id]}
							onChange={(e) => {
								selectRef.current[id] = e.target.checked;
							}}
							isDisabled={!!voteInfo}
							disabled={!!voteInfo}
							size={"md"}
							classNames={{
								base: cn(
									"inline-flex w-full max-w-md bg-content1",
									"hover:bg-content2 items-center justify-start",
									"cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
									"data-[selected=true]:border-sky-500"
								),
								label: "w-full",
							}}
						>
							<p className=" font-medium w-full p-1 pl-0 text-sm outline-none border-b-0  ">
								{value}
							</p>
						</Checkbox>
					</div>
				))}
			</div>
			{!voteInfo ? (
				<div className=" w-full mt-5 px-10 flex justify-end">
					<Button
						size="sm"
						className=" bg-sky-100"
						color={"secondary"}
						variant={"flat"}
						onClick={onSubmit}
					>
						<p className=" flex items-center gap-3 text-sky-800 font-semibold">
							<FcComboChart size={20} />
							Send
						</p>
					</Button>
				</div>
			) : null}
		</div>
	) : null;
}
