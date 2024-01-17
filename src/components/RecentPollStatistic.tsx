"use client";

import useRecentPoll from "@/hooks/useRecentPoll";
import { FcSalesPerformance } from "react-icons/fc";
import VotePieChart from "./VotePieChart";

export default function RecentPollStatistic() {
	const { poll, votes } = useRecentPoll();

	return poll ? (
		<div className=" w-full shadow-lg">
			<p className=" flex items-center px-2 py-3 bg-cyan-500 text-white text-sm font-semibold w-full">
				View your recent poll result
				<FcSalesPerformance size={20} className=" ml-2" />
			</p>
			<div className=" pl-4 py-4 w-full bg-white">
				<p className=" text-lg font-semibold mb-4">{poll.question}</p>
				<div className="flex justify-between gap-4 w-fll">
					<div className="flex flex-col gap-1 ">
						{poll.choices.split("_").map((choice, i) => (
							<p
								key={choice}
								className=" flex gap-2 py-1 px-2 rounded-md border-0 border-slate-400 text-slate-700 text-sm font-medium"
							>
								<div
									className=" h-full w-2"
									style={{ backgroundColor: COLORS[i] }}
								/>
								{choice}
							</p>
						))}
					</div>
					<VotePieChart choices={poll.choices.split("_")} votes={votes} />
				</div>
			</div>
		</div>
	) : null;
}

const COLORS = ["#3CAEF4", "#42E68E", "#BBE1FC", "#C7B8FF"];
