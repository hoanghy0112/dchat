"use client";

import Button from "@/components/Button";
import FeedList from "@/components/FeedList";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { addCollectionData } from "@/hooks/useData";
import IFeed from "@/types/IFeed";
import { getCookie } from "cookies-next";
import { Textarea } from "flowbite-react";
import { FormEventHandler, useCallback, useRef, useState } from "react";

export default function Page() {
	const uid = getCookie(COOKIES.UID);

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const contentRef = useRef<HTMLTextAreaElement>(null);

	const addToFeed = useCallback(
		(text: string) => {
			if (!uid) return;

			const value: IFeed = {
				date: new Date().toISOString(),
				content: text,
				isVisible: true,
				uid: uid?.toString(),
			};
			addCollectionData([COLLECTIONS.FEED])(value);
		},
		[uid]
	);

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			const value = contentRef.current?.value;
			if (!value) {
				alert("Content must not be empty");
				return;
			}
			addToFeed(value);
			setIsOpen(false);

			contentRef.current.value = "";
		},
		[addToFeed]
	);

	return (
		<div className=" pt-5 flex flex-col overflow-x-hidden gap-5 w-full">
			<form
				className=" flex flex-col gap-3 px-5 w-full justify-center"
				onSubmit={onSubmit}
			>
				<Textarea
					placeholder="How do you feel today!!!"
					//@ts-ignore
					size="xs"
					className=" px-2 py-3 w-full bg-white rounded-xl"
					ref={contentRef}
					onFocus={() => setIsOpen(true)}
					type="text"
				/>
				{isOpen && (
					<div className="flex justify-end gap-3">
						<div className=" flex-1 flex gap-3"></div>
						<Button
							btnType={"secondary"}
							className=" w-fit "
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button className=" w-fit " type="submit">
							Post
						</Button>
					</div>
				)}
			</form>
			<FeedList />
		</div>
	);
}
