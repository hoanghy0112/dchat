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
import { useEffect, useState } from "react";
import { HiOutlinePlus, HiSearch } from "react-icons/hi";
import { useDebounce } from "react-use";
import Image from "next/image";
import { useCollectionList } from "@/hooks/useData";
import COLLECTIONS from "@/constants/collection";
import ChatUser from "./ChatUser";
import { TextInput } from "flowbite-react";

function UserList({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const router = useRouter();
	const db = getDB();

	const uid = getCookie(COOKIES.UID) || "";

	const [isOpen, setIsOpen] = useState(false);
	const [keyword, setKeyword] = useState("");

	const { data: userList } = useCollectionList<IUser>(
		[COLLECTIONS.USERS, uid, COLLECTIONS.MESSAGE_USERS],
		"uid"
	);

	return (
		<div className={className}>
			{userList.map((user) => (
				<ChatUser key={user.uid} uid={user.uid} />
			))}
		</div>
	);
}

export default UserList;
