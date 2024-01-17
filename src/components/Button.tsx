"use client";

import {
	ButtonSizes,
	CustomFlowbiteTheme,
	Button as _Button,
	Spinner,
	ButtonProps,
} from "flowbite-react";

import React, { ReactNode } from "react";

export default function Button({
	fill = true,
	size = "md",
	btnType = "primary",
	children = "Untitle",
	hiddenTitle,
	className,
	ref,
	isLoading = false,
	...props
}: PropTypes) {
	return (
		<_Button
			theme={getTheme(fill)}
			color={btnType}
			className={`${className} group transition-all duration-300`}
			size={size}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? (
				<Spinner size={size} />
			) : (
				<div className=" h-fit flex items-center">
					{children}
					{hiddenTitle ? (
						<p className=" font-semibola overflow-hidden w-fit max-w-0 group-hover:max-w-[70px] group-hover:ml-2 transition-all duration-300">
							{hiddenTitle}
						</p>
					) : null}
				</div>
			)}
		</_Button>
	);
}

const getTheme = (isFill: boolean): CustomFlowbiteTheme["button"] => {
	if (isFill)
		return {
			color: {
				primary:
					"bg-sky-300 hover:bg-sky-400 focus:ring-sky-100 text-white",
				secondary:
					"bg-white hover:bg-gray-50 focus:ring-gray-100 text-gray-900",
				error: "bg-red-500 hover:bg-red-600 focus:ring-red-100 text-white",
			},
			size: {}
		};
	return {
		color: {
			primary:
				"bg-transparent hover:bg-sky-50 focus:ring-sky-100 text-sky-600",
			secondary:
				"bg-transparent hover:bg-gray-50 focus:ring-gray-100 text-gray-900",
			error: "bg-transparent hover:bg-red-50 focus:ring-error-100 text-color-error",
		},
	};
};

type PropTypes = ButtonProps &
	React.ComponentPropsWithRef<"button"> & {
		fill?: boolean;
		size?: keyof ButtonSizes;
		btnType?: "primary" | "secondary" | "error";
		isLoading?: boolean;
		hiddenTitle?: string;
		children?: ReactNode;
	};
