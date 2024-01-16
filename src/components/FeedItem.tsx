"use client";

import COLLECTIONS from "@/constants/collection";
import { DB_KEYS } from "@/constants/dbKeys";
import { addCollectionData, useCollectionList, useItem } from "@/hooks/useData";
import IFeed, { IComment } from "@/types/IFeed";
import IUser from "@/types/IUser";
import Image from "next/image";
import CommentItem from "./CommentItem";
import { FormEventHandler, useCallback, useRef } from "react";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";

export default function FeedItem({
	info: { date, content, isVisible, uid },
}: {
	info: IFeed;
}) {
	const currentUID = getCookie(COOKIES.UID);

	const commentRef = useRef<HTMLInputElement>(null);

	const [user] = useItem<IUser>(DB_KEYS.USERS, uid);
	const { data: likes } = useCollectionList<IUser>([
		COLLECTIONS.FEED,
		date,
		COLLECTIONS.LIKES,
	]);
	const { data: comments } = useCollectionList<IComment>([
		COLLECTIONS.FEED,
		date,
		COLLECTIONS.COMMENTS,
	]);

	const addComment = useCallback(
		(text: string) => {
			if (!currentUID) return;

			const value: IComment = {
				date: new Date().toISOString(),
				content: text,
				isVisible: true,
				uid: currentUID?.toString(),
			};
			addCollectionData([COLLECTIONS.FEED, date, COLLECTIONS.COMMENTS])(
				value
			);
		},
		[uid]
	);

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
		e.preventDefault();
		const value = commentRef.current?.value;
		if (!value) {
			alert("Content must not be empty");
			return;
		}
		addComment(value);
	}, []);

	return (
		<div>
			{user ? (
				<div className=" flex gap-3">
					<Image
						className=" rounded-full"
						src={user.photo || ""}
						width={50}
						height={50}
						alt={""}
					/>
					<div>
						<p>{user.displayName}</p>
						<p>{date}</p>
					</div>
				</div>
			) : null}
			<p>{content}</p>
			<div className=" flex justify-between">
				<p>{likes.length} likes</p>
				<div>
					<form onSubmit={onSubmit}>
						<input ref={commentRef} type="text" />
						<button type="button">Submit</button>
					</form>
					{comments.map((comment) => (
						<CommentItem key={comment.date} info={comment} />
					))}
				</div>
			</div>
		</div>
	);
}
