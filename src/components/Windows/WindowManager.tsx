import React, { RefObject, useMemo, useRef } from 'react';
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

	const windowsArray = useMemo(() => Array.from(windows.values()), []);

	const { visibleWindows, topWindow } = useMemo(() => {
		return {
			visibleWindows: windowOrder
				.map((id) => windows.get(id) as App.Window)
				.toArray(),
			topWindow: windowOrder.last(null),
		};
	}, [windowOrder]);

	const { dispatch } = useDispatch();

	const refs = windowsArray.reduce((refs, window) => {
		refs[window.id] = useRef(null);
		return refs;
	}, {} as Record<App.Window['id'], RefObject<HTMLDivElement>>);

	if (!visibleWindows.length) return null;

	return (
		<div className={classes.windowsBlock()}>
			{visibleWindows.map(
				({ id, status, position, width, height }, zIndex) => {
					const { icon, title, Content } = windowRegistry.get(id)!;
					const isMaximized = status === 'maximized';
					const ref = refs[id];

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

					const onContainerMouseDown = () => {
						ref.current!.style.zIndex = '99';
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
							ref={ref}
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
							onContainerMouseDown={onContainerMouseDown}
						>
							<Content />
						</Window>
					);
				}
			)}
		</div>
	);
};
