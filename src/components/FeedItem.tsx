"use client";

import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import { addCollectionData, useCollectionList, useItem } from "@/hooks/useData";
import IFeed, { IComment, IFeedPhoto, ILike } from "@/types/IFeed";
import IUser from "@/types/IUser";
import { Button, Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEventHandler, useCallback, useRef, useState } from "react";
import { IoHeart } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa6";

import ButtonCustom from "./Button";
import CommentItem from "./CommentItem";
import { IPhoto } from "@/types/IPhoto";
import SquareDiv from "./SquareDiv";
import ImageStorage from "./ImageStorage";
import { Carousel } from "flowbite-react";

export default function FeedItem({
	info: { date, content, isVisible, uid },
}: {
	info: IFeed;
}) {
	const router = useRouter();

	const currentUID = getCookie(COOKIES.UID);

	const [isOpenComment, setIsOpenComment] = useState(false);

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
	const { data: photos } = useCollectionList<IPhoto>([
		COLLECTIONS.FEED,
		date,
		COLLECTIONS.PHOTOS,
	]);

	const isLiked = likes.some(({ uid }) => uid == currentUID);

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

		if (isLiked) return;

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
			commentRef.current.value = "";
		},
		[addComment]
	);

	return (
		<div className=" shadow-md w-1/2 mx-[2px] mobile:max-sm:mt-2 mobile:max-sm:w-full flex-row self-center bg-white rounded-none rounded-b-large justify-center items-center mt-4 md:mt-2 ">
			{user ? (
				<div
					onClick={() =>
						router.push(uid != currentUID ? `/users/${uid}` : "/profile")
					}
					className=" bg-white flex gap-3 p-4 relative duration-200 hover:bg-slate-100 active:bg-slate-200"
				>
					<Image
						className=" rounded-full"
						src={user.photo || ""}
						width={40}
						height={40}
						alt={""}
					/>
					<div>
						<p className=" font-semibold text-sm">{user.displayName}</p>
						<p className=" text-xs text-gray-600">
							{moment(new Date(date || new Date())).fromNow()}
						</p>
					</div>
				</div>
			) : null}
			<div className=" bg-white my-1 mb-3 mx-5">
				<p className=" text-sm font-medium">{content}</p>
			</div>
			{/* <div className=" grid grid-cols-2">
				{photos.map(({ url }, index) => (
					<SquareDiv
						className={` fixed w-full bg-slate-200 cursor-pointer active:bg-slate-300 duration-200 ${
							photos.length == 1 ||
							(photos.length >= 3 && photos.length != 4 && index == 0)
								? " col-span-2"
								: ""
						}`}
					>
						<ImageStorage src={url} />
					</SquareDiv>
				))}
			</div> */}
			<Carousel className=" p-3 bg-white" slide={false} slideInterval={1000}>
				{photos.map(({ url }, index) => (
					<SquareDiv
						key={url}
						className={` w-full bg-slate-200 cursor-pointer duration-200`}
					>
						<ImageStorage src={url} />
					</SquareDiv>
				))}
			</Carousel>
			<div className=" flex justify-between bg-white border-t-1 border-gray-300">
				<div className=" flex px-3 py-2 items-center">
					<ButtonCustom
						name="like"
						size="xs"
						btnType={isLiked ? "primary" : "secondary"}
						className={`${isLiked ? " text-white" : "text-black"}`}
						onClick={addLike}
					>
						<IoHeart size={20} />
					</ButtonCustom>
					<p className=" mx-2 text-black font-semibold text-sm">
						{likes.length} likes
					</p>
				</div>
			</div>
			{isOpenComment ? (
				<>
					<div className=" bg-white pt-2 border-t-1 border-gray-300">
						{comments.map((comment) => (
							<CommentItem key={comment.date} info={comment} />
						))}
						<form
							className=" flex items-center gap-3 px-3 my-3 w-full justify-center"
							onSubmit={onSubmit}
						>
							{
								<Input
									//@ts-ignore
									size="xs"
									className=" flex-1 text-sm border-gray-300 bg-white rounded-xl"
									ref={commentRef}
									type="text"
								/>
							}
							<Button
								isIconOnly
								className=" w-fit bg-white"
								size={"sm"}
								type="submit"
							>
								<LuSendHorizonal size={20} />
							</Button>
						</form>
					</div>
					<div
						onClick={() => setIsOpenComment(false)}
						className=" overflow-hidden rounded-b-lg border-t-slate-300 border-t-[1px] p-3 grid place-items-center hover:bg-slate-100 active:bg-slate-200 duration-200"
					>
						<p className=" font-medium text-sm flex items-center gap-2">
							Hide
							<FaChevronDown className=" rotate-180" />
						</p>
					</div>
				</>
			) : (
				<div
					onClick={() => setIsOpenComment(true)}
					className=" overflow-hidden rounded-b-lg border-t-slate-300 border-t-[1px] p-3 grid place-items-center hover:bg-slate-100 active:bg-slate-200 duration-200"
				>
					<p className=" font-medium text-sm flex items-center gap-2">
						Comments
						<FaChevronDown />
					</p>
				</div>
			)}
		</div>
	);
}
