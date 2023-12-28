"use client";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import useDB, { getDB } from "@/hooks/useDB";
import IUser from "@/types/IUser";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlinePlus, HiSearch } from "react-icons/hi";
import { useDebounce } from "react-use";

export default function UserSearch({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const router = useRouter();
	const db = getDB();

	const uid = getCookie(COOKIES.UID);

	const [isOpen, setIsOpen] = useState(false);
	const [keyword, setKeyword] = useState("");

	const [userList, setUserList] = useState<IUser[]>([]);

	useDebounce(
		() => {
			const list: IUser[] = [];
			db.get(DB_KEYS.USERS)
				.map()
				.once((data: IUser) => {
					if (data.uid != uid) list.push(data);
				});
			setUserList(list);
		},
		200,
		[keyword]
	);

	const handleChoose = (uid: string) => () => {
		setIsOpen(false);
		router.replace(`home/?uid=${uid}`);
	};

	return (
		<div
			className={` w-full flex flex-col items-center ${className}`}
			{...props}
		>
			<Button
				color={"primary"}
				className=" font-medium px-5"
				variant={"flat"}
				startContent={<HiOutlinePlus size={20} />}
				onClick={() => setIsOpen(true)}
			>
				Add conversation
			</Button>
			<Modal size={"2xl"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Find user
							</ModalHeader>
							<ModalBody>
								<Input
									type="text"
									label=""
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									labelPlacement={"outside"}
									startContent={<HiSearch size={20} />}
									onClear={() => setKeyword("")}
								/>
								<ul className="h-full mt-5 ">
									{userList.map(({ uid, displayName, email }) => (
										<li
											className=" h-full flex justify-between px-2 py-3 rounded-md hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 cursor-pointer"
											key={uid}
											onClick={handleChoose(uid)}
										>
											<p className=" font-semibold">{displayName}</p>
											<p>{email}</p>
										</li>
									))}
								</ul>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
