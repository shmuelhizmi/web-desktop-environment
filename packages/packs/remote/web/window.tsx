import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import {
	ViewsProvider,
	windowBarHeight,
} from "@web-desktop-environment/web-sdk";
import {
	createXpraWindowBaseZindex,
	XpraClient,
	XpraWindowManager,
	XpraWindowManagerWindow,
} from "xpra-html5-client";
import WindowViewInterface, {
	WindowState,
} from "@web-desktop-environment/interfaces/lib/views/Window";

interface XpraWindowRendererProps {
	window: XpraWindowManagerWindow;
	vm: XpraWindowManager;
	xpra: XpraClient;
	icon?: string;
	children?: React.ReactNode;
	// position: {
	// 	x: number;
	// 	y: number;
	// };
}

function getInputProps({ vm, window }: XpraWindowRendererProps) {
	return {
		onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.mouseButton(window, e as unknown as MouseEvent, true);
			vm.setActiveWindow(window.attributes.id);
		},
		onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.mouseButton(window, e as unknown as MouseEvent, false);
			vm.setActiveWindow(-1);
		},
		onMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.mouseMove(window, e as unknown as MouseEvent);
		},
		onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.mouseWheel(window, e as unknown as WheelEvent);
		},
		onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.keyPress(window, e as unknown as KeyboardEvent, true);
		},
		onKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.keyPress(window, e as unknown as KeyboardEvent, false);
		},
		onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			vm.keyPress(window, e as unknown as KeyboardEvent, true);
		},
		onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
			vm.setActiveWindow(window.attributes.id);
			e.currentTarget.tabIndex = 0;
		},
		onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			vm.setActiveWindow(window.attributes.id);
			e.currentTarget.tabIndex = 0;
		},
		onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
			e.currentTarget.tabIndex = -1;
		},
	};
}

export function WindowBase(
	props: React.PropsWithChildren<WindowViewInterface["props"]>
) {
	return (
		<ViewsProvider<ViewInterfacesType>>
			{({ Window }) => (
				<Window
					{...props}
					window={{
						...props.window,
						position: {
							x: props.window.position?.x ?? 0,
							y: (props.window.position?.y ?? 0) - windowBarHeight,
						},
						height: props.window?.height
							? props.window?.height + windowBarHeight
							: undefined,
					}}
					setWindowState={(state: WindowState) => {
						props.setWindowState({
							...state,
							position: state.position && {
								x: state.position.x,
								y: state.position.y + windowBarHeight,
							},
							size: state.size && {
								width: state.size.width ?? 0,
								height: (state.size.height ?? 0) - windowBarHeight,
							},
						});
					}}
				/>
			)}
		</ViewsProvider>
	);
}

let zIndex = 0;

export function XpraWindowRenderer(props: XpraWindowRendererProps) {
	const { window, vm, xpra, icon } = props;
	const winRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = React.useState<{ width: number; height: number }>({
		width: window.attributes.dimension[0],
		height: window.attributes.dimension[1],
	});
	const [isMinimized, setIsMinimized] = React.useState(false);
	const inputProps = useMemo(() => getInputProps(props), [props]);

	useEffect(() => {
		if (winRef.current) {
			const ele = winRef.current;
			ele.appendChild(window.canvas);
			window.canvas.style.borderBottomLeftRadius = "5px";
			window.canvas.style.borderBottomRightRadius = "5px";
		}
		xpra.sendConfigureWindow(
			window.attributes.id,
			window.attributes.position,
			window.attributes.dimension,
			{},
			{},
			false
		);
		vm.raise(window);
	}, []);

	useEffect(() => {
		setSize({
			width: window.attributes.dimension[0],
			height: window.attributes.dimension[1],
		});
	}, [...window.attributes.dimension, ...window.attributes.position]);

	const onWindowSetState = useCallback(
		(state: WindowState) => {
			const minimized = state.minimized ?? isMinimized;

			if (!minimized && (state.position || state.size)) {
				vm.moveResize(
					window,
					state.position
						? [state.position.x, state.position.y]
						: window.attributes.position,
					state.size
						? [state.size.width, state.size.height]
						: window.attributes.dimension
				);
				setSize(
					state.size || {
						width: window.attributes.dimension[0],
						height: window.attributes.dimension[1],
					}
				);
			}
			if (minimized && !isMinimized) {
				setIsMinimized(true);
				vm.minimize(window);
			} else if (!minimized && isMinimized) {
				setIsMinimized(false);
				vm.raise(window);
			}
		},
		[vm, window]
	);

	const windowTypes = window.attributes.metadata["window-type"];
	const borderless = !!windowTypes.find(
		(type) =>
			type.includes("DROPDOWN") ||
			type.includes("TOOLTIP") ||
			type.includes("POPUP") ||
			type.includes("MENU") ||
			type.includes("COMBO")
	);

	const content = (
		<div
			style={{ width: size.width, height: size.height }}
			key={window.attributes.id}
			ref={winRef}
			{...inputProps}
		>
			{props.children}
		</div>
	);

	if (borderless) {
		return (
			<div
				style={{
					width: size.width,
					height: size.height,
					top: window.attributes.position[1],
					left: window.attributes.position[0],
					zIndex: createXpraWindowBaseZindex(window.attributes, ++zIndex),
					position: "fixed",
				}}
				ref={winRef}
				{...inputProps}
			/>
		);
	}
	return (
		<WindowBase
			background="transparent"
			borderless={borderless}
			icon={
				icon ? { type: "img", icon: icon } : { type: "icon", icon: "FcLinux" }
			}
			name={window.attributes.metadata.title}
			onClose={() => vm.close(window)}
			setWindowState={(state) => {
				onWindowSetState(state);
			}}
			title={window.attributes.metadata.title}
			window={{
				allowLocalScreenSnapping: false,
				height: size.height,
				width: size.width,
				maxHeight: globalThis.screen.height,
				maxWidth: globalThis.screen.width,
				minHeight: 50,
				minWidth: 50,
				position: {
					x: window.attributes.position[0],
					y: window.attributes.position[1],
				},
			}}
		>
			{content}
		</WindowBase>
	);
}
