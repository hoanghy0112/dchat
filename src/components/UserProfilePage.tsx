"use client";

import Button from "@/components/Button";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import {
	addCollectionData,
	useCollectionItem,
	useCollectionList,
} from "@/hooks/useData";
import { IPhoto } from "@/types/IPhoto";
import IUser, { IFriend, IInvitation, IRequest } from "@/types/IUser";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEventHandler, useCallback, useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { IoChatboxOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import ImageList from "./ImageList";
import toast from "react-hot-toast";

export default function UserProfilePage({ uid }: { uid: string }) {
	const router = useRouter();
	const currentUID = getCookie(COOKIES.UID) || "";

	const user = useCollectionItem<IUser>([COLLECTIONS.USERS, uid]);

	const { data: photos } = useCollectionList<IPhoto>([
		COLLECTIONS.USERS,
		uid,
		COLLECTIONS.PHOTOS,
	]);
	const { data: userBio } = useCollectionList<{ bio: string; date: string }>([
		COLLECTIONS.USERS,
		uid,
		COLLECTIONS.BIO,
	]);

	const [bio, setBio] = useState<string>();

	const [isOpenEdit, setIsOpenEdit] = useState(false);

	const { data: friends } = useCollectionList<IFriend>([
		COLLECTIONS.USERS,
		uid,
		COLLECTIONS.FRIENDS,
	]);

	const { data: invitations } = useCollectionList<IInvitation>(
		[COLLECTIONS.USERS, uid, COLLECTIONS.INVITATION],
		"uid"
	);

	const { data: requests } = useCollectionList<IRequest>(
		[COLLECTIONS.USERS, currentUID, COLLECTIONS.REQUESTS],
		"uid"
	);

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();

			setIsOpenEdit(false);
			addCollectionData([COLLECTIONS.USERS, uid, COLLECTIONS.BIO])(
				{
					bio,
					date: new Date().toISOString(),
					key: "bio",
				},
				"key"
			);
		},
		[bio, uid]
	);

	return user ? (
		<div className=" w-full flex flex-col gap-0 bg-white">
			<p className=" mt-5 text-center font-bold text-sm">
				{user.displayName}
			</p>
			<div className=" mt-7 px-5 flex gap-6 items-center">
				<Image
					className=" rounded-full h-fit"
					src={user?.photo || ""}
					width={70}
					height={70}
					alt=""
				/>
				<div className=" flex flex-col items-center">
					<p className=" text-2xl font-semibold">{friends.length}</p>
					<p className=" text-xs">Friends</p>
				</div>
				<div className=" flex flex-col items-center">
					<p className=" text-2xl font-semibold">{invitations.length}</p>
					<p className=" text-xs">Followers</p>
				</div>
			</div>
			<p className=" mt-6 text-sm px-5">
				Biography of{" "}
				<span className=" font-semibold">{user.displayName}</span>:
			</p>
			<div className=" px-5 mt-6 ">
				{isOpenEdit ? (
					<div className=" w-full">
						<form className=" w-full" onSubmit={onSubmit}>
							<textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								rows={4}
								className=" p-2 text-sm w-full border-[1px] border-slate-300 rounded-lg"
							/>
							<div className=" flex gap-3 mt-3">
								<Button
									type="submit"
									className=" flex-1"
									btnType={"primary"}
								>
									<IoMdCheckmark size={20} className="mr-2" /> Save
								</Button>
								<Button
									onClick={() => setIsOpenEdit(false)}
									className=" bg-slate-100"
									btnType={"secondary"}
								>
									<IoClose size={20} />
								</Button>
							</div>
						</form>
					</div>
				) : (
					<div className=" flex flex-col gap-3">
						<p className=" text-sm">{userBio.at(0)?.bio}</p>
						<div className="flex gap-3">
							{friends.some(({ uid }) => uid == currentUID) ? (
								<Button
									onClick={() => {
										router.push(`/messages/${uid}`);
									}}
									className=" flex-1"
									btnType={"primary"}
								>
									<IoChatboxOutline size={20} className=" mr-2" /> Send
									message
								</Button>
							) : requests.some(
									(value) =>
										value.uid == uid && value.state == "pending"
							  ) ? (
								<p className=" w-full p-2 text-center rounded-lg bg-slate-100 font-semibold text-sm">
									Your request is sent
								</p>
							) : (
								<Button
									onClick={() => {
										toast.success("Your request has been sent");
										addCollectionData([
											COLLECTIONS.USERS,
											currentUID,
											COLLECTIONS.REQUESTS,
										])(
											{
												uid,
												date: new Date().toISOString(),
												state: "pending",
											},
											"uid"
										);
										addCollectionData([
											COLLECTIONS.USERS,
											uid,
											COLLECTIONS.INVITATION,
										])(
											{
												uid: currentUID,
												date: new Date().toISOString(),
												state: "pending",
											},
											"uid"
										);
									}}
									className=" flex-1"
									btnType={"primary"}
								>
									<FaUserPlus size={20} className=" mr-2" /> Add friend
								</Button>
							)}
							{/* <Button
								onClick={() => router.push("add-friend")}
								className=" bg-slate-100"
								btnType={"secondary"}
							>
								<FaUserPlus size={20} />
							</Button> */}
						</div>
					</div>
				)}
			</div>
			<ImageList photos={photos} />
		</div>
	) : null;
}
