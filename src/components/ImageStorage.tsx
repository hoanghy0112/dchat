import { storage } from "@/services/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageStorage({ src }: { src: string }) {
	const [url, setUrl] = useState<string>();
	const [isSeleted, setIsSelected] = useState<boolean>(false);

	useEffect(() => {
		getDownloadURL(ref(storage, src))
			.then((url) => {
				setUrl(url);
			})
			.catch((error) => {
				switch (error.code) {
					case "storage/object-not-found":
						setUrl(undefined);
						// File doesn't exist
						break;
					case "storage/unauthorized":
						// User doesn't have permission to access the object
						break;
					case "storage/canceled":
						// User canceled the upload
						break;

					case "storage/unknown":
						// Unknown error occurred, inspect the server response
						break;
				}
			});
	}, []);

	return url ? (
		<>
			<Image
				onClick={() => setIsSelected(true)}
				className=" rounded-lg cursor-pointer"
				src={url}
				layout="fill"
				objectFit="cover"
				alt="image"
			/>
			{isSeleted && (
				<>
					<div
						className=" fixed bg-gray-800 opacity-50 w-screen h-screen top-0 left-0 z-10"
						onClick={() => setIsSelected(false)}
					/>
					<div className="  z-20 w-5/6 h-[300px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						<Image
							src={url}
							className=" rounded-2xl w-full"
							layout="fill"
							objectFit="cover"
							alt="image"
						/>
					</div>
				</>
			)}
		</>
	) : null;
}
