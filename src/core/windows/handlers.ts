import { isDefaultPositions } from './helpers';

const setRect: Actions.Handler<{
	id: Store.Window['id'];
	position?: Store.Window['position'];
	width?: Store.Window['width'];
	height?: Store.Window['height'];
}> = (state, { id, position, width, height }) => {
	return (state as any).updateIn(['windows', id], (window: Store.Window) =>
		window.withMutations((window) => {
			window
				.set('position', position ?? window.position)
				.set('width', width ?? window.width)
				.set('height', height ?? window.height);
		})
	);
};

const bringToFront: Actions.Handler<{
	id: Store.Window['id'];
}> = (state, { id }) => {
	return state.update('windowOrder', (order) =>
		order.withMutations((windowOrder) => {
			windowOrder.delete(id).add(id);
		})
	);
};

const open: Actions.Handler<{
	id: Store.Window['id'];
}> = (state, { id }) => {
	const targetWindow = state.windows.get(id)!;
	const topWindow = state.windowOrder.last(null);

	return state.withMutations((state) => {
		(state as any).setIn(['windows', id, 'status'], 'open');
		bringToFront(state, { id });

		if (
			topWindow &&
			topWindow !== id &&
			isDefaultPositions(targetWindow, state.windows.get(topWindow)!)
		) {
			setRect(state, {
				id,
				position: Object.entries(targetWindow.position).reduce(
					(result, [side, value]) => {
						result[side] = value + 4;
						return result;
					},
					{} as AnyObject
				),
			});
		}
	});
};

const close: Actions.Handler<{
	id: Store.Window['id'];
}> = (state, { id }) => {
	return state.withMutations((state) => {
		(state as any).setIn(['windows', id, 'status'], 'closed');
		state.update('windowOrder', (order) => order.delete(id));
	});
};

const minimize: Actions.Handler<{
	id: Store.Window['id'];
}> = (state, { id }) => {
	return state.withMutations((state) => {
		(state as any).setIn(['windows', id, 'status'], 'minimized');
		state.update('windowOrder', (order) => order.delete(id));
	});
};

const maximize: Actions.Handler<{
	id: Store.Window['id'];
}> = (state, { id }) => {
	return state.withMutations((state) => {
		(state as any).setIn(['windows', id, 'status'], 'maximized');
		bringToFront(state, { id });
	});
};

export const handlers = {
	'@windows/setRect': setRect,
	'@windows/open': open,
	'@windows/close': close,
	'@windows/minimize': minimize,
	'@windows/maximize': maximize,
	'@windows/bringToFront': bringToFront,
};
