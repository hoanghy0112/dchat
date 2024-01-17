import { IPhoto } from "@/types/IPhoto";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import ImageStorage from "./ImageStorage";
import SquareDiv from "./SquareDiv";

export default function ImageList({
	photos,
	children,
}: {
	photos: IPhoto[];
	children?: ReactNode;
}) {
	const [selectedId, setSelectedId] = useState<IPhoto>();

	return (
		<>
			<div className=" mt-8 px-0 w-full grid gap-1 grid-cols-3 sm:grid-cols-4">
				{children}
				{photos.map(({ url, date, uid }) => (
					<div key={url} onClick={() => setSelectedId({ url, date, uid })}>
						<SquareDiv className=" fixed w-full bg-slate-200 cursor-pointer active:bg-slate-300 duration-200">
							<ImageStorage src={url} />
						</SquareDiv>
					</div>
				))}
			</div>
			{selectedId && (
				<>
					<div
						className=" fixed bg-gray-800 opacity-50 w-screen h-screen top-0 left-0 z-10"
						onClick={() => setSelectedId(undefined)}
					/>
					<div className=" z-20 w-5/6 h-[400px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						<ImageStorage src={selectedId.url} />
					</div>
				</>
			)}
		</>
	);
}
