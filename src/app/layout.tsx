import { getCookie } from "cookies-next";

// import "gun/sea";
// import "gun/axe";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Decentralize Chat application",
	description: "Generated by create next app",
};

export default function RootLayout({
	signin,
	home,
}: {
	signin: ReactNode;
	home: ReactNode;
}) {
	const uid = cookies().get(COOKIES.UID)?.value || "";
	console.log({ uid });

	return (
		<html lang="en">
			<body className={inter.className}>{uid ? home : signin}</body>
		</html>
	);
}
