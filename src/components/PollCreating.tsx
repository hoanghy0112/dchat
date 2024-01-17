"use client";

import { Button, Checkbox } from "@nextui-org/react";
import { useCallback, useRef, useState } from "react";
import { FcDataSheet, FcBullish, FcComboChart } from "react-icons/fc";
import { GoPlus } from "react-icons/go";
import { Transition } from "@headlessui/react";
import { IPoll } from "@/types/IFeed";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";
import { addCollectionData } from "@/hooks/useData";
import COLLECTIONS from "@/constants/collection";

export default function PollCreating() {
	const uid = getCookie(COOKIES.UID) || "";

	const [isOpen, setIsOpen] = useState(false);

	const questionRef = useRef<HTMLInputElement>(null);

	const [choices, setChoices] = useState<string[]>([
		"First choice",
		"Second choice",
	]);

	const onSubmit = useCallback(() => {
		if (!questionRef.current?.value) return;

		const poll: IPoll = {
			question: questionRef.current.value,
			uid,
			date: new Date().toISOString(),
			choices: choices.filter((v) => v != "").join("_"),
		};

		setIsOpen(false);

		addCollectionData([COLLECTIONS.POLLS])(poll);
	}, [questionRef, choices]);

	return (
		<div>
			<div
				className={` w-full overflow-hidden flex flex-col justify-evenly items-center duration-300 ${
					isOpen ? " h-0" : " h-[200px]"
				}`}
			>
				<div className=" w-full py-5 bg-purple-500 flex flex-col gap-3 items-center">
					<p className=" px-5 text-lg text-center text-white">
						With DChat, you can create a poll everywhere.
					</p>
					<Button
						className=" mt-3 bg-white"
						color={"secondary"}
						variant={"flat"}
						onClick={() => setIsOpen(true)}
					>
						<p className=" flex items-center gap-2 text-purple-800 font-semibold">
							<FcComboChart size={20} />
							Create a poll now
						</p>
					</Button>
					<p className=" text-xs text-white">
						Anyone can see this poll and do it
					</p>
				</div>
			</div>
			<Transition
				show={isOpen}
				className=" h-fit relative bg-white py-8 z-20 shadow-lg"
				enter="transition-all ease-in-out duration-300"
				enterFrom="opacity-0 h-0"
				enterTo="opacity-100 h-fit"
				leave="transition-all ease-in-out duration-300"
				leaveFrom="opacity-100 h-fit"
				leaveTo="opacity-0 h-0"
			>
				<div className=" flex flex-col items-center gap-0">
					<p className=" mb-2 text-xs text-slate-600">
						Enter you poll question below
					</p>
					<input
						ref={questionRef}
						placeholder="What do you want to ask?"
						className=" text-center mx-20 w-fit min-w-[100px] text-xl outline-none border-b-2 border-slate-400"
					/>
					<div className=" mt-8 flex flex-col gap-2">
						<Button
							size="sm"
							className=" bg-purple-100"
							color={"secondary"}
							variant={"flat"}
							onClick={() => {
								setChoices((prev) => ["", ...prev]);
							}}
						>
							<p className=" flex text-sm items-center gap-2 text-purple-800 font-semibold">
								<GoPlus size={20} />
								Add choice
							</p>
						</Button>
						{choices.map((value, id) => (
							<div
								key={id}
								className=" flex gap-1 p-2 rounded-lg border-1 border-slate-100"
							>
								<Checkbox size={"md"} color="success" />
								<input
									value={value}
									onChange={(e) => {
										const newChoices = [...choices];
										newChoices[id] = e.target.value;
										console.log(newChoices);
										setChoices([...newChoices]);
									}}
									placeholder="Answer choice"
									className=" p-1 text-sm outline-none border-b-2  border-slate-400"
								/>
							</div>
						))}
					</div>
					<div className=" w-full mt-8 px-10 flex justify-between">
						<Button
							size="sm"
							variant={"flat"}
							onClick={() => setIsOpen(false)}
						>
							<p className=" flex items-center gap-3 font-semibold">
								Close
							</p>
						</Button>
						<Button
							size="sm"
							className=" bg-purple-100"
							color={"secondary"}
							variant={"flat"}
							onClick={onSubmit}
						>
							<p className=" flex items-center gap-3 text-purple-800 font-semibold">
								<FcComboChart size={20} />
								Create
							</p>
						</Button>
					</div>
				</div>
			</Transition>
		</div>
	);
}
