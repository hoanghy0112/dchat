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

function UserList({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const db = getDB();

    const uid = getCookie(COOKIES.UID);

    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState("");

    const [userList, setUserList] = useState<IUser[]>([]);

    const fetchData = () => {
        const list: IUser[] = [];
      
        db.get(DB_KEYS.USERS)
          .map()
          .once((data: IUser) => {
            if (data.uid != uid)
            { 
                list.push(data);
                setUserList(list);
            }
          });

        console.log(list)
        console.log(userList);
      };

    const handleChoose = (uid: string) => () => {
        setIsOpen(false);
        router.replace(`/home/${uid}`);
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
                {userList.map(({ uid, displayName, photo }) => (
                    <div
                        className=" h-full flex justify-between px-2 py-3 rounded-md hover:bg-slate-400 active:bg-slate-200 transition-all duration-200 cursor-pointer"
                        key={uid}
                        onClick={handleChoose(uid)}
                    >
                        <Image
							className=" rounded-full"
							src={photo || ""}
							width={50}
							height={50}
							alt={""}
						/>
                        <p className=" font-semibold">{displayName}</p>
                    </div>
                ))}
        </>
    );
}

export default UserList;