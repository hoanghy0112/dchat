"use client";

import FeedList from "@/components/FeedList";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { addCollectionData } from "@/hooks/useData";
import IFeed from "@/types/IFeed";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { FormEventHandler, useCallback, useRef } from "react";

export default function Page() {
	const uid = getCookie(COOKIES.UID);

	const contentRef = useRef<HTMLInputElement>(null);

	const addToFeed = useCallback(
		(text: string) => {
			if (!uid) return;

			const key = new Date().toISOString();
			const value: IFeed = {
				date: new Date().toISOString(),
				content: text,
				isVisible: true,
				uid: uid?.toString(),
			};
			addCollectionData(COLLECTIONS.FEED)(key, value);
		},
		[uid]
	);

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			const value = contentRef.current?.value;
			console.log({ value });
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
			<form onSubmit={onSubmit}>
				<input ref={contentRef} type="text" />
				<button type="button">Submit</button>
			</form>
			<FeedList />
		</div>
	);
}
