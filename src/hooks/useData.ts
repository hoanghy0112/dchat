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

export function useCollectionList<T extends { date?: string }>(
	refList: string[],
	key = "date"
): { data: T[] } {
	const [data, setData] = useState<Map<string, T>>(new Map());

	useDeepCompareEffect(() => {
		if (refList.length % 2 != 1) {
			console.error("Ref list in collection list must be an odd number");
			return;
		}

		let dbRef = getDB().get(refList[0]);
		refList.slice(1).forEach((ref) => (dbRef = dbRef.get(ref)));
		dbRef.map().on((data) => {
			setData((prev) => {
				const newMap = new Map(prev.entries());
				if (!data[key]) {
					console.error(`Key "${key}" not found in data`, { data });
					return newMap;
				}
				newMap.set(data[key], data);
				return newMap;
			});
		});
	}, [refList]);

	return {
		data: Array.from(data.values()).sort((a, b) =>
			a.date && b.date
				? new Date(b.date).getTime() - new Date(a.date).getTime()
				: 1
		),
	};
}

export const addCollectionData =
	(collections: string[]) =>
	(value: any, key = "date") => {
		if (collections.length % 2 != 1) {
			console.error(
				"addCollectionData: collections length must be an odd number"
			);
			return;
		}
		if (!value.date) {
			console.error("addCollectionData: value does not contain date field");
			return;
		}

		let dbRef = getDB().get(collections[0]);
		collections.slice(1).forEach((ref) => (dbRef = dbRef.get(ref)));
		const date = new Date().toISOString();
		console.log({ dbRef, value });
		dbRef.get(value[key]).put({
			...value,
			...(value.date ? {} : { date: new Date().toISOString() }),
		});
		return date;
	};

export const addItemData = (collections: string[]) => (value: any) => {
	if (collections.length % 2 != 0) {
		console.error("addItemData: collections length must be an even number");
		return;
	}

	let dbRef = getDB().get(collections[0]);
	collections.slice(1).forEach((ref) => (dbRef = dbRef.get(ref)));
	dbRef.put(value);
	const date = new Date().toISOString();
	return date;
};

export function useItem<T>(collection: string, id: string) {
	const [data, setData] = useState<T>();

	useEffect(() => {
		getDB()
			.get(collection)
			.get(id)
			.on((data) => {
				setData(data);
			});
	}, [collection, id]);

	return [data];
}

export function useCollectionItem<T>(refList: string[]): T | undefined {
	const [data, setData] = useState<T>();

	useDeepCompareEffect(() => {
		if (refList.length % 2 != 0) {
			console.error("Ref list in collection item must be an even number");
			return;
		}

		let dbRef = getDB().get(refList[0]);
		refList.slice(1).forEach((ref) => (dbRef = dbRef.get(ref)));
		dbRef.on((data) => {
			setData(data);
		});

		return () => {
			dbRef.off();
		};
	}, [refList]);

	return data;
}
