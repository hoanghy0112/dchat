import React, { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";

export const UserCard = ({
	children,
	style,
	onVote,
	id,
	...props
}: React.ComponentProps<"div"> & {
	children: ReactNode;
	onVote: (d: any) => any;
	drag: boolean;
}) => {
	// motion stuff
	const cardElem = useRef<HTMLDivElement>(null);
	const isDragging = useRef<boolean>(false);
	const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	const x = useMotionValue(0);
	const controls = useAnimation();

	const [constrained, setConstrained] = useState(true);

	const [direction, setDirection] = useState<"left" | "right" | undefined>();

	const [velocity, setVelocity] = useState<number>();

	const getVote = (childNode: HTMLElement, parentNode: HTMLElement) => {
		const childRect = childNode.getBoundingClientRect();
		const parentRect = parentNode.getBoundingClientRect();
		let result =
			parentRect.left + 50 >= childRect.right
				? false
				: parentRect.right - 50 <= childRect.left
				? true
				: undefined;
		return result;
	};

	// determine direction of swipe based on velocity
	const getDirection = () => {
		if (!velocity) return undefined;
		return velocity >= 1 ? "right" : velocity <= -1 ? "left" : undefined;
	};

	const getTrajectory = () => {
		setVelocity(x.getVelocity());
		setDirection(getDirection());
	};

	const flyAway = (min: number) => {
		const flyAwayDistance = (direction: "left" | "right" | undefined) => {
			if (!cardElem.current?.parentElement) return 0;
			const parentWidth =
				cardElem.current.parentElement.getBoundingClientRect().width;
			const childWidth = cardElem.current.getBoundingClientRect().width;
			return direction === "left"
				? -parentWidth / 2 - childWidth / 2
				: parentWidth / 2 + childWidth / 2;
		};

		if (direction && Math.abs(velocity || 0) > min) {
			setConstrained(false);
			controls.start({
				x: flyAwayDistance(direction),
			});
		}
	};

	useEffect(() => {
		const unsubscribeX = x.onChange(() => {
			if (cardElem.current && cardElem.current.parentElement) {
				const childNode = cardElem.current;
				const parentNode = cardElem.current.parentElement;
				const result = getVote(childNode, parentNode);
				// result !== undefined && onVote(result);
			}
		});

		return () => unsubscribeX();
	});

	useEffect(() => {
		const listener = (event: MouseEvent) => {
			mousePos.current = { x: event.clientX, y: event.clientY };
		};
		window.addEventListener("mousemove", listener);

		return () => {
			window.removeEventListener("mousemove", listener);
		};
	}, []);

	return (
		<motion.div
			className=" absolute"
			animate={controls}
			dragConstraints={
				constrained && { left: 0, right: 0, top: 0, bottom: 0 }
			}
			dragElastic={1}
			//@ts-ignore
			ref={cardElem}
			//@ts-ignore
			style={{ x }}
			//@ts-ignore
			onDrag={(e) => {
				getTrajectory();
				isDragging.current = true;
			}}
			//@ts-ignore
			onDragEnd={() => {
				flyAway(500);
				if (mousePos.current.x < 50) onVote(false);
				else if (
					mousePos.current.x >
					document.body.getBoundingClientRect().width - 50
				)
					onVote(true);
			}}
			whileTap={{ scale: 1.2 }}
			{...props}
		>
			{children}
		</motion.div>
	);
};
