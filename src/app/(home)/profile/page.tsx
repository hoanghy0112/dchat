"use client";

import Button from "@/components/Button";
import ImageList from "@/components/ImageList";
import ImageStorage from "@/components/ImageStorage";
import SquareDiv from "@/components/SquareDiv";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import {
	addCollectionData,
	useCollectionItem,
	useCollectionList,
} from "@/hooks/useData";
import { storage } from "@/services/firebase";
import { IPhoto } from "@/types/IPhoto";
import IUser, { IFriend, IInvitation } from "@/types/IUser";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useRef,
	useState,
} from "react";
import { FaUserPlus } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";

export default function Page() {
	const router = useRouter();

	const uid = getCookie(COOKIES.UID) || "";
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

	// const bioRef = useRef<HTMLTextAreaElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);
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

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();

			setIsOpenEdit(false);
			// updateUser({ ...user, bio: "Hello" });
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

	const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const file = e.target.files?.item(0);
			if (!file) return;

			const url = `photo-${uid}-${new Date().toISOString()}-${file.name}`;
			const storageRef = ref(storage, url);
			uploadBytes(storageRef, file).then((snapshot) => {
				console.log("Uploaded a file!");
				addCollectionData([COLLECTIONS.USERS, uid, COLLECTIONS.PHOTOS])({
					date: new Date().toISOString(),
					url,
					uid,
				});
			});
		},
		[]
	);

	return user ? (
		<div className=" w-screen h-screen flex flex-col gap-0 bg-white">
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
								// ref={bioRef}
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
							<Button
								onClick={() => {
									setIsOpenEdit(true);
									setBio(userBio.at(0)?.bio);
								}}
								className=" flex-1"
								btnType={"primary"}
							>
								<GoPencil size={18} className="mr-2" /> Edit
							</Button>
							<Button
								onClick={() => {
									deleteCookie(COOKIES.UID);
									router.push("/signin");
								}}
								className=" bg-slate-100"
								btnType={"secondary"}
							>
								<VscSignOut size={20} />
							</Button>
						</div>
					</div>
				)}
			</div>
			<ImageList photos={photos}>
				<SquareDiv
					onClick={() => {
						fileRef.current?.click();
					}}
					className=" w-full bg-slate-200 cursor-pointer active:bg-slate-300 duration-200"
				>
					<FiPlus size={25} />
				</SquareDiv>
			</ImageList>

			<input
				onChange={onFileChange}
				className=" h-0 w-0"
				ref={fileRef}
				type={"file"}
			/>
		</div>
	) : null;
}
