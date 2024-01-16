import React, { useState, Children, ReactNode } from "react";
import { UserCard } from "./UserCard";

export const UserStack = ({
	onVote,
	children,
	...props
}: React.ComponentProps<"div"> & {
	children: ReactNode;
	onVote: (d: any, d2: any) => any;
}) => {
	const [stack, setStack] = useState(Children.toArray(children));

	const pop = (array: any[]) => {
		return array.filter((_, index) => {
			return index < array.length - 1;
		});
	};

	const handleVote = (item: any, vote: any) => {
		// update the stack
		let newStack = pop(stack);
		setStack(newStack);

		// run function from onVote prop, passing the current item and value of vote
		onVote(item, vote);
	};

	return (
		<div
			className=" w-full flex-1 overflow-hidden flex justify-center items-center relative"
			{...props}
		>
			{stack.map((item, index) => {
				let isTop = index === stack.length - 1;
				return (
					<UserCard
						drag={isTop} // Only top card is draggable
						//@ts-ignore
						key={item.key || index}
						onVote={(result) => handleVote(item, result)}
					>
						{item}
					</UserCard>
				);
			})}
		</div>
	);
};
