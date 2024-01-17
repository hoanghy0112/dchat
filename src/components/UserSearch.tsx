"use client";

import { COOKIES } from "@/constants/cookies";
import { DB_KEYS } from "@/constants/dbKeys";
import useDB, { getDB } from "@/hooks/useDB";
import IUser from "@/types/IUser";
import {
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
import { BsPencilSquare } from "react-icons/bs";
import { useDebounce } from "react-use";
import Button from "./Button";
import { addCollectionData, useCollectionList } from "@/hooks/useData";
import COLLECTIONS from "@/constants/collection";
import SearchUser from "./SearchUser";

export default function UserSearch({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const router = useRouter();
	const db = getDB();

	const uid = getCookie(COOKIES.UID);
	const currentUID = getCookie(COOKIES.UID) || "";

	const [isOpen, setIsOpen] = useState(false);
	const [keyword, setKeyword] = useState("");

	const { data: userList } = useCollectionList<IUser>(
		[COLLECTIONS.USERS],
		"uid"
	);
	const { data: messageUsers } = useCollectionList<IUser>(
		[COLLECTIONS.MESSAGE_USERS],
		"uid"
	);

	const handleChoose = (uid: string) => () => {
		setIsOpen(false);
		router.replace(`/messages/${uid}`);
		addCollectionData([
			COLLECTIONS.USERS,
			currentUID,
			COLLECTIONS.MESSAGE_USERS,
		])({
			date: new Date().toISOString(),
			uid,
		});
		addCollectionData([COLLECTIONS.USERS, uid, COLLECTIONS.MESSAGE_USERS])({
			date: new Date().toISOString(),
			uid: currentUID,
		});
	};

	return (
		<div className={` flex flex-col items-center ${className}`} {...props}>
			<Button
				btnType={"secondary"}
				className=" font-medium"
				onClick={() => setIsOpen(true)}
			>
				<BsPencilSquare size={20} />
			</Button>
			<Modal size={"full"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
									{userList
										.filter(
											({ uid }) =>
												uid != currentUID &&
												messageUsers.every(
													({ uid: m_uid }) => m_uid != uid
												)
										)
										.map(({ uid, displayName, email }) => (
											<SearchUser
												key={uid}
												className=" -mx-3"
												onClick={handleChoose(uid)}
												uid={uid}
											/>
										))}
								</ul>
							</ModalBody>
							{/* <ModalFooter>
								<Button onClick={onClose}>Close</Button>
								<Button color="primary" onClick={onClose}>
									Action
								</Button>
							</ModalFooter> */}
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
