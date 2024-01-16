import { useEffect, useState } from "react";
import { getDB } from "./useDB";
import { useDeepCompareEffect } from "react-use";

export function useList<T>(collection: string): { data: T[] } {
	const [data, setData] = useState<Map<string, T>>(new Map());

	useEffect(() => {
		getDB()
			.get(collection)
			.map()
			.on((data) => {
				setData((prev) => {
					const newMap = new Map(prev.entries());
					if (!data.date) {
						console.error("Date not found in data");
						return newMap;
					}
					newMap.set(data.date, data);
					return newMap;
				});
			});
	}, [collection]);

	return { data: Array.from(data.values()) };
}

export function useCollectionList<T>(refList: string[]): { data: T[] } {
	const [data, setData] = useState<Map<string, T>>(new Map());

	useDeepCompareEffect(() => {
		if (refList.length % 2 != 1) {
			console.error("Ref list in collection must be an odd number");
			return;
		}

		let dbRef = getDB().get(refList[0]);
		refList.slice(1).forEach((ref) => (dbRef = dbRef.get(ref)));
		dbRef.map().on((data) => {
			setData((prev) => {
				const newMap = new Map(prev.entries());
				if (!data.date) {
					console.error("Date not found in data");
					return newMap;
				}
				newMap.set(data.date, data);
				return newMap;
			});
		});
	}, [refList]);

	return { data: Array.from(data.values()) };
}

export const addCollectionData =
	(collection: string) => (key: string, value: any) => {
		console.log({ abc: value, key });
		getDB().get(collection).get(key).put(value);
	};

export function useItem<T>(collection: string, id: string) {
	const [data, setData] = useState<T>();
	useEffect(() => {
		getDB()
			.get(collection)
			.get(id)
			.once((data) => {
				setData(data);
			});
	}, [collection, id]);

	return [data];
}
