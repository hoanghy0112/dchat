"use client";

import COLLECTIONS from "@/constants/collection";
import { DB_KEYS } from "@/constants/dbKeys";
import { addCollectionData, useCollectionList, useItem } from "@/hooks/useData";
import IFeed, { IComment, ILike } from "@/types/IFeed";
import IUser from "@/types/IUser";
import Image from "next/image";
import CommentItem from "./CommentItem";
import { FormEventHandler, useCallback, useRef } from "react";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/constants/cookies";
import { BiSolidLike } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import Button from "./Button";
import { Input } from "@nextui-org/react";

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
		[currentUID, date]
	);

	const addLike = useCallback(() => {
		if (!currentUID) return;

		console.log({ likes });
		if (likes.some(({ uid }) => uid == currentUID)) return;

		const value: ILike = {
			date: new Date().toISOString(),
			uid: currentUID?.toString(),
		};
		addCollectionData([COLLECTIONS.FEED, date, COLLECTIONS.LIKES])(value);
	}, [currentUID, date, likes]);

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();
			const value = commentRef.current?.value;
			if (!value) {
				alert("Content must not be empty");
				return;
			}
			addComment(value);
		},
		[addComment]
	);

	return (
		<div className=" w-1/2 mx-[2px] mobile:max-sm:mt-2 mobile:max-sm:w-[300px] flex-row self-center bg-white rounded-2xl justify-center items-center mt-4 md:mt-2 shadow-black shadow-large">
			{user ? (
				<div className=" flex gap-3 p-4 relative">
					<Image
						className=" rounded-full"
						src={user.photo || ""}
						width={50}
						height={50}
						alt={""}
					/>
					<div>
						<p className=" font-medium">{user.displayName}</p>
						<p className=" text-sm text-gray-600">
							{date.slice(0, 10)}
							<span>:{date.slice(11, 16)}</span>
						</p>
					</div>
				</div>
			) : null}
			<div className=" my-3 mx-4">
				<p>{content}</p>
			</div>
			<div className=" flex justify-between border-t-1 border-gray-600">
				<div className=" flex  m-3 items-center">
					<Button name="like" className=" text-black" onClick={addLike}>
						<BiSolidLike />
					</Button>
					<p className=" mx-2 text-gray-600">{likes.length} likes</p>
				</div>
				<div className=" flex items-center justify-center mx-5">
					<FaCommentAlt />
					<p className=" ml-3">Comments</p>
				</div>
			</div>
			<div className=" border-t-1 border-gray-600">
				{comments.map((comment) => (
					<CommentItem key={comment.date} info={comment} />
				))}
				<form
					className=" flex mx-4 my-3 w-full mobile:max-sm:mx-2 justify-center"
					onSubmit={onSubmit}
				>
					{
						<Input
							//@ts-ignore
							size="xs"
							className=" w-3/4 mobile:max-sm:w-2/3 border border-gray-600 rounded-xl min-[425px]:w-2/3"
							ref={commentRef}
							type="text"
						/>
					}
					<button
						className=" bg-[#7DD3FC] mobile:max-sm:w-1/4 mobile:max-sm:mx-2 mx-3 px-2 rounded-xl mobile:max-sm:text-xs"
						type="submit"
					>
						Comment
					</button>
				</form>
			</div>
		</div>
	);
}
