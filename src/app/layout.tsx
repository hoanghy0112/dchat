import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import "./globals.css";
import { getCookie } from "cookies-next";

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
	const uid = getCookie("uid") || "";
	console.log({ uid });

	return (
		<html lang="en">
			<body className={inter.className}>{uid ? home : signin}</body>
		</html>
	);
}
