import { storage } from "@/services/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageStorage({ src }: { src: string }) {
	const [url, setUrl] = useState<string>();

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
			<Image src={url} layout="fill" objectFit="cover" alt="image" />
		</>
	) : null;
}
