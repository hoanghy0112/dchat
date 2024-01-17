import Image from "next/image";

export default function SquareDiv({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			{...props}
			className={` relative after:contents block pb-[100%] ${className}`}
		>
			<div className=" absolute w-full h-full grid place-items-center">
				{children}
			</div>
		</div>
	);
}
