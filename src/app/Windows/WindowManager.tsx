import { RefObject, useMemo, useRef, useEffect, useCallback } from 'react';

import './window-manager.scss';

import {
	useDispatch,
	useSelector,
	mutations,
	Mutations,
	MutationListener,
	appHandlers,
} from '../../core';
import { Window, WindowRef } from './Window/Window';
import { windowRegistry } from './registry';
import { bem } from '../../utils';

const classes = bem('windows');

const nullPosition: Position = { left: 0, top: 0 };

const isWindowHidden = (window: Store.Window) => {
	return window.status === 'closed' || window.status === 'minimized';
};

const forceTopLayer = (window: WindowRef | null, enable = true) => {
	window?.container?.classList[enable ? 'add' : 'remove']('top-window');
};

export const WindowManager: React.FC = () => {
	const { windows, windowOrder } = useSelector((state) => ({
		windows: state.windows,
		windowOrder: state.windowOrder,
	}));

	const windowsArray = useMemo(() => Array.from(windows.values()), []);

	const windowRefMap = windowsArray.reduce((refs, window) => {
		refs[window.id] = useRef(null);
		return refs;
	}, {} as Record<Store.Window['id'], RefObject<WindowRef>>);

	const windowRefArray = useMemo(() => Object.values(windowRefMap), []);

	const { visibleWindows, topWindow } = useMemo(() => {
		return {
			visibleWindows: windowOrder
				.map((id) => windows.get(id) as Store.Window)
				.toArray(),
			topWindow: windowOrder.last(null),
		};
	}, [windowOrder]);

	const { dispatch, batch } = useDispatch();

	useEffect(() => {
		windowRefArray.forEach(({ current: window }) => {
			forceTopLayer(window, false);
		});
	});

	const onWindowStatusChange = useCallback(
		({ state, window }: Mutations['WINDOW_STATUS_CHANGE']) => {
			const windowRect = windowRefMap[window.id].current?.rect;

			if (isWindowHidden(window) && windowRect) {
				appHandlers['windows/setRect'](state, {
					id: window.id,
					...windowRect,
				});
			}
		},
		[]
	);

	useEffect(() => {
		const listener: MutationListener = {
			type: 'WINDOW_STATUS_CHANGE',
			act: onWindowStatusChange,
		};

		mutations.on(listener);
		return () => {
			mutations.off(listener);
		};
	}, []);

	if (!visibleWindows.length) return null;

	return (
		<div className={classes.windowsBlock()}>
			{visibleWindows.map(
				({ id, position, width, height, isMaximized }, zIndex) => {
					const { icon, title, Content } = windowRegistry.get(id)!;
					const ref = windowRefMap[id];

					const onClose = () => {
						dispatch.windows.close({ id });
					};

					const onMinimize = () => {
						dispatch.windows.minimize({ id });
					};

					const onMaximize = () => {
						batch((dispatch) => {
							dispatch.windows.setIsMaximized({
								id,
								isMaximized: !isMaximized,
							});

							if (!isMaximized) {
								dispatch.windows.setRect({
									id,
									...ref.current!.rect,
								});
							}
						});
					};

					const onContainerMouseDown = () => {
						forceTopLayer(ref.current);
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
							onMinimize={onMinimize}
							onMaximize={onMaximize}
							onClose={onClose}
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
