"use client";

import FONT from "@/constants/fontFamily";
import { IVote } from "@/types/IFeed";
import {
	ArcElement,
	Chart as ChartJS,
	Legend,
	RadialLinearScale,
	Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, RadialLinearScale, Tooltip, Legend);

export default function VotePieChart({
	choices,
	votes,
}: {
	choices: string[];
	votes: IVote[];
}) {
	const options = {
		responsive: true,
		interaction: {
			intersect: false,
		},
		cutout: "75%",
		borderWidth: 0,
		plugins: {
			legend: {
				position: "bottom" as const,
				align: "center" as const,
				padding: 100,
				title: {
					padding: 100,
				},
				labels: {
					padding: 10,
					pointStyle: "circle" as const,
					boxWidth: 6,
					boxHeight: 6,
					usePointStyle: true,
					font: {
						size: 14,
						weight: "normal",
					},
				},
			},
			title: {
				display: false,
				text: "",
			},
		},
		scales: {},
	};

	const data = {
		labels: choices,
		datasets: [
			{
				label: "Number",
				data: choices.map(
					(choice, index) =>
						votes.filter(
							(vote) => vote.choices.split("_")[index] == "true"
						).length
				),
				borderColor: "#FFCB1B",
				backgroundColor: ["#3CAEF4", "#BBE1FC", "#42E68E", "#C7B8FF"],
				hoverOffset: 8,
				rAxisID: "r",
			},
		],
	};

	console.log({ data });

	return (
		<div className=" w-fit relative mt-0 px-0 sm:px-8 my-5">
			<div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[90%]">
				<p className=" text-secondary-950 font-semibold text-3xl text-center">
					{votes.length}
				</p>
				<p className=" text-secondary-600 text-center">votes</p>
			</div>
			<div className=" relative max-w-[200px] mx-auto">
				{
					//@ts-ignore
					<Doughnut options={options} data={data} />
				}
			</div>
		</div>
	);
}
