"use client";

import { COOKIES } from "@/constants/cookies";
import { getCookie } from "cookies-next";
import { ReactNode } from "react";

export default function Page({
	chatBox,
	chatList,
}: {
	chatBox: ReactNode;
	chatList: ReactNode;
}) {
	const displayName = getCookie(COOKIES.DISPLAY_NAME);

	return <div>Hello, {displayName}</div>;
}
