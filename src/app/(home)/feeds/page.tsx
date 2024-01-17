"use client";

import FeedList from "@/components/FeedList";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { addCollectionData } from "@/hooks/useData";
import IFeed from "@/types/IFeed";
import { Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { FormEventHandler, useCallback, useRef } from "react";

export default function Page() {
	const uid = getCookie(COOKIES.UID);

	const contentRef = useRef<HTMLInputElement>(null);

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
		},
		[addToFeed]
	);

	return (
		<div>
			<form
				className=" flex px-4 py-3 w-full justify-center"
				onSubmit={onSubmit}
			>
				<Input
					label="How do you feel today!!!"
					//@ts-ignore
					size="xs"
					className=" w-3/4 bg-white rounded-xl"
					ref={contentRef}
					type="text"
				/>
				<button
					className=" bg-[#7DD3FC] mx-3 px-2 rounded-xl"
					type="submit"
				>
					Post
				</button>
			</form>
			<FeedList />
		</div>
	);
}
