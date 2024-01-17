"use client";

import Button from "@/components/Button";
import FeedList from "@/components/FeedList";
import ImageStorage from "@/components/ImageStorage";
import SquareDiv from "@/components/SquareDiv";
import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { addCollectionData } from "@/hooks/useData";
import { storage } from "@/services/firebase";
import IFeed from "@/types/IFeed";
import { deleteCookie, getCookie } from "cookies-next";
import { ref, uploadBytes } from "firebase/storage";
import { Textarea } from "flowbite-react";
import {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useRef,
	useState,
} from "react";
import { FaImages } from "react-icons/fa6";
import { FcFullTrash } from "react-icons/fc";
import { VscSignOut } from "react-icons/vsc";
import { IoTrashOutline } from "react-icons/io5";

import Image from "next/image";
import { useRouter } from "next/navigation";
import RecentPollStatistic from "@/components/RecentPollStatistic";

export default function Page() {
	const router = useRouter();

	const uid = getCookie(COOKIES.UID);
	const displayName = getCookie(COOKIES.DISPLAY_NAME);
	const photo = getCookie(COOKIES.PHOTO);

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const contentRef = useRef<HTMLTextAreaElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const [files, setFiles] = useState<FileList>();

	const addToFeed = useCallback(
		(text: string) => {
			if (!uid) return;

			const date = new Date().toISOString();
			const value: IFeed = {
				date,
				content: text,
				isVisible: true,
				uid: uid?.toString(),
			};
			addCollectionData([COLLECTIONS.FEED])(value);

			if (!files) return;
			for (let i = 0; i < files.length; i++) {
				const file = files.item(i);
				if (file == null) return;
				const url = `photo-${uid}-${new Date().toISOString()}-${file.name}`;
				const storageRef = ref(storage, url);
				uploadBytes(storageRef, file).then((snapshot) => {
					addCollectionData([COLLECTIONS.FEED, date, COLLECTIONS.PHOTOS])({
						date: new Date().toISOString(),
						url,
						uid,
					});
					addCollectionData([COLLECTIONS.USERS, uid, COLLECTIONS.PHOTOS])({
						date: new Date().toISOString(),
						url,
						uid,
					});
				});
			}
		},
		[uid, files]
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
			setFiles(undefined);

			contentRef.current.value = "";
		},
		[addToFeed]
	);

	const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const files = e.target.files;
			if (!files || !files?.length) return;
			setFiles(files);
		},
		[]
	);

	return (
		<div className=" pt-5 flex flex-col overflow-x-hidden gap-5 w-full">
			<div className=" pr-3 flex justify-between">
				<h1 className=" font-bold text-2xl px-4">
					Hello,
					<br /> {displayName}
				</h1>
				<Button
					onClick={() => {
						deleteCookie(COOKIES.UID);
						router.push("/signin");
					}}
					className=" h-fit"
					btnType={"secondary"}
				>
					<VscSignOut size={18} />
				</Button>
			</div>
			<form
				className=" mb-3 flex flex-col gap-3 px-3 w-full justify-center"
				onSubmit={onSubmit}
			>
				<div className=" flex gap-3">
					<Image
						onClick={() => router.push(`/profile`)}
						className=" mt-2 h-fit rounded-full"
						src={photo || ""}
						width={30}
						height={30}
						alt={""}
					/>
					<Textarea
						placeholder="How do you feel today!!!"
						//@ts-ignore
						size="xs"
						rows={isOpen ? 4 : 2}
						className=" px-3 py-3 w-full bg-white rounded-xl"
						ref={contentRef}
						onFocus={() => setIsOpen(true)}
						// onBlur={() => setIsOpen(false)}
						type="text"
					/>
				</div>
				{files?.length && isOpen ? (
					<div className=" p-2 bg-slate-200 rounded-lg grid grid-cols-4 gap-3">
						{Array(files?.length)
							.fill("")
							.map((_, i) =>
								files?.item(i) != null ? (
									<SquareDiv
										key={i}
										className=" fixed w-full bg-slate-200 cursor-pointer active:bg-slate-300 duration-200"
									>
										<Image
											//@ts-ignore
											src={URL.createObjectURL(files?.item(i))}
											layout="fill"
											objectFit="cover"
											alt=""
										/>
									</SquareDiv>
								) : null
							)}
						<SquareDiv>
							<Button
								onClick={() => setFiles(undefined)}
								className=" w-full h-full"
								btnType={"error"}
							>
								<IoTrashOutline className=" text-white" size={20} />
							</Button>
						</SquareDiv>
					</div>
				) : null}

				{isOpen && (
					<div className="flex justify-end gap-3">
						<div className=" flex-1 flex gap-3">
							<Button
								btnType={"secondary"}
								size={"sm"}
								className=" w-fit "
								onClick={() => {
									fileRef.current?.click();
								}}
							>
								<FaImages />
							</Button>
						</div>
						<Button
							size={"sm"}
							btnType={"secondary"}
							className=" w-fit "
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button size={"sm"} className=" w-fit " type="submit">
							Post
						</Button>
					</div>
				)}
			</form>
			<RecentPollStatistic />
			<FeedList />
			<input
				onChange={onFileChange}
				className="h-0 w-0"
				ref={fileRef}
				type="file"
				multiple
			/>
		</div>
	);
}
