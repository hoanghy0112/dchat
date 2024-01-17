import React, { useRef, useEffect, useState, ReactNode, useMemo } from "react";
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
	const rotateDegree = useMemo(() => Math.random() * 15 - 7, []);

	const [dragState, setDragState] = useState<boolean | undefined>();

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
		const onMousePosChange = ({ x, y }: { x: number; y: number }) => {
			if (x < 50) setDragState(false);
			else if (x > document.body.getBoundingClientRect().width - 50)
				setDragState(true);
			else setDragState(undefined);
		};
		const listenerMouse = (event: MouseEvent) => {
			mousePos.current = { x: event.clientX, y: event.clientY };
			onMousePosChange(mousePos.current);
		};

		const listenerTouch = (event: TouchEvent) => {
			mousePos.current = {
				x: event.touches.item(0)?.clientX || 0,
				y: event.touches.item(0)?.clientY || 0,
			};
			onMousePosChange(mousePos.current);
		};

		window.addEventListener("mousemove", listenerMouse);
		window.addEventListener("touchmove", listenerTouch);

		return () => {
			window.removeEventListener("mousemove", listenerMouse);
			window.removeEventListener("touchmove", listenerTouch);
		};
	}, []);

	return (
		<>
			<motion.div
				className=" z-0 absolute transition-[rotate] duration-500"
				animate={controls}
				dragConstraints={
					constrained && { left: 0, right: 0, top: 0, bottom: 0 }
				}
				dragElastic={1}
				//@ts-ignore
				ref={cardElem}
				//@ts-ignore
				style={{ x, rotate: rotateDegree }}
				//@ts-ignore
				onDrag={(e) => {
					getTrajectory();
					isDragging.current = true;
				}}
				//@ts-ignore
				onDragEnd={() => {
					flyAway(500);
					isDragging.current = false;
					if (mousePos.current.x < 50) onVote(false);
					else if (
						mousePos.current.x >
						document.body.getBoundingClientRect().width - 50
					)
						onVote(true);
				}}
				whileTap={{ scale: 1.1, rotate: 0 }}
				whileHover={{ scale: 1.1, rotate: 0 }}
				{...props}
			>
				{children}
			</motion.div>
			{isDragging.current ? (
				<>
					<div
						className={` absolute top-0 left-0 w-[50px] h-full z-10 duration-150 transition-all opacity-0 bg-red-600 ${
							dragState === true
								? ""
								: dragState === false
								? " opacity-35"
								: ""
						}`}
					/>
					<div
						className={` absolute top-0 right-0 w-[50px] h-full z-10 duration-150 transition-all opacity-0 bg-sky-600 ${
							dragState === true
								? " opacity-35"
								: dragState === false
								? ""
								: ""
						}`}
					/>
				</>
			) : null}
		</>
	);
};
