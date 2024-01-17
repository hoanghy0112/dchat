import COLLECTIONS from "@/constants/collection";
import { useCollectionList } from "@/hooks/useData";
import IUser from "@/types/IUser";
import { Carousel } from "flowbite-react";
import Image from "next/image";
import ImageStorage from "./ImageStorage";
import SquareDiv from "./SquareDiv";
import { IPhoto } from "@/types/IPhoto";

export default function UserCardInner({
	user: { email, displayName, photo, uid },
}: {
	user: IUser;
}) {
	const { data: photos } = useCollectionList<IPhoto>([
		COLLECTIONS.USERS,
		uid,
		COLLECTIONS.PHOTOS,
	]);

	return (
		<div
			key={email}
			className=" bg-white border-1 border-slate-200 overflow-hidden w-[270px] h-[400px] flex flex-col items-center justify-center font-semibold text-xl shadow-sm rounded-lg"
			data-value="waffles"
		>
			<Carousel
				className=" flex-1 mb-5 bg-white"
				slide={false}
				slideInterval={1000}
			>
				{photos.map(({ url }, index) => (
					<SquareDiv
						key={url}
						className={` w-full bg-slate-200 cursor-pointer active:bg-slate-300 duration-200`}
					>
						<ImageStorage src={url} />
					</SquareDiv>
				))}
			</Carousel>
			<div className="  bg-slate-200 w-full px-3 py-3 flex flex-initial gap-3">
				<Image
					className=" w-10 h-10 rounded-full flex-initial"
					src={photo || ""}
					width={40}
					height={40}
					alt={""}
				/>
				<div className="">
					<p className=" font-semibold text-sm">{displayName}</p>
					<p className=" text-xs font-normal text-zinc-700">{email}</p>
				</div>
			</div>
		</div>
	);
}
