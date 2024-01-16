import { useEffect, useRef } from "react";

export default function useMousePosition() {
	const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	useEffect(() => {
		const listenerMouse = (event: MouseEvent) => {
			mousePos.current = { x: event.clientX, y: event.clientY };
		};

		const listenerTouch = (event: TouchEvent) => {
			mousePos.current = {
				x: event.touches.item(0)?.clientX || 0,
				y: event.touches.item(0)?.clientY || 0,
			};
		};

		window.addEventListener("mousemove", listenerMouse);
		window.addEventListener("touchmove", listenerTouch);

		return () => {
			window.removeEventListener("mousemove", listenerMouse);
			window.removeEventListener("touchmove", listenerTouch);
		};
	}, []);
}
