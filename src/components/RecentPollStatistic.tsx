"use client";

import useRecentPoll from "@/hooks/useRecentPoll";
import { FcSalesPerformance } from "react-icons/fc";
import VotePieChart from "./VotePieChart";


export default function RecentPollStatistic() {
	const { poll, votes } = useRecentPoll();

	return poll ? (
		<div className=" w-full shadow-lg">
			<p className=" flex items-center px-2 py-3 bg-sky-500 text-white text-sm font-semibold w-full">
				View your recent poll result
				<FcSalesPerformance  size={20} className=" ml-2" />
			</p>
			<div className=" pl-4 py-4 w-full bg-white">
				<p className=" text-sm font-medium mb-4">
					Here is the statistic about the poll
				</p>
				<VotePieChart choices={poll.choices.split("_")} votes={votes} />
			</div>
		</div>
	) : null;
}
