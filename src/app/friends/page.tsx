"use client";

import COLLECTIONS from "@/constants/collection";
import { COOKIES } from "@/constants/cookies";
import { useCollectionList } from "@/hooks/useData";
import { getCookie } from "cookies-next";

import { UserStack } from "@/components/UserStack";
import UserCardInner from "@/components/UserCardInner";
import IUser from "@/types/IUser";

export default function Page() {
	const currentUID = getCookie(COOKIES.UID);

	const { data: friends } = useCollectionList([
		COLLECTIONS.USERS,
		currentUID || "",
		COLLECTIONS.FRIENDS,
	]);

	const { data: users } = useCollectionList<IUser>(
		[COLLECTIONS.USERS],
		"email"
	);

	return (
		<div className=" relative w-screen h-screen flex flex-col">
			<UserStack
				key={users.length}
				onVote={(item, vote) => console.log(item.props, vote)}
			>
				{users.map((user) => (
					<UserCardInner user={user} key={user.email} />
				))}
			</UserStack>
		</div>
	);
}
