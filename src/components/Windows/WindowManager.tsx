import React, { Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from '../../core';
import { Window, WindowProps } from './Window/Window';
import { windowRegistry } from './registry';
import { bem } from '../../utils';

const classes = bem('windows');

const nullPosition: Position = { left: 0, top: 0 };

export const WindowManager: React.FC = () => {
	const { windows, windowOrder } = useSelector((state) => ({
		windows: state.windows,
		windowOrder: state.windowOrder,
	}));

	const { windowsArray, topWindow } = useMemo(() => {
		return {
			windowsArray: windowOrder
				.map((windowId) => windows.get(windowId) as App.Window)
				.toArray(),
			topWindow: windowOrder.last(null),
		};
	}, [windowOrder]);

	const { dispatch } = useDispatch();

	if (!windowsArray.length) return null;

	return (
		<div className={classes.windowsBlock()}>
			{windowsArray.map(
				({ id, status, position, width, height }, zIndex) => {
					const { icon, title, Content } = windowRegistry.get(id)!;
					const isMaximized = status === 'maximized';

					const onReposition: WindowProps['onReposition'] = (
						position
					) => {
						dispatch.windows.setRect({ id, position });
					};

					const onResize: WindowProps['onResize'] = (
						width,
						height
					) => {
						dispatch.windows.setRect({ id, width, height });
					};

					const onMinimize = () => {
						dispatch.windows.minimize({ id });
					};

					const onMaximize = () => {
						isMaximized
							? dispatch.windows.open({ id })
							: dispatch.windows.maximize({ id });
					};

					const onClose = () => {
						dispatch.windows.close({ id });
					};

					const onContainerClick = () => {
						if (topWindow !== id) {
							dispatch.windows.bringToFront({ id });
						}
					};

					return (
						<Window
							style={{ zIndex }}
							key={id}
							title={title}
							icon={icon}
							width={isMaximized ? window.innerWidth : width}
							height={isMaximized ? window.innerHeight : height}
							position={isMaximized ? nullPosition : position}
							isMaximized={isMaximized}
							onReposition={onReposition}
							onMinimize={onMinimize}
							onMaximize={onMaximize}
							onClose={onClose}
							onResize={onResize}
							onContainerClick={onContainerClick}
						>
							<Content />
						</Window>
					);
				}
			)}
		</div>
	);
};
