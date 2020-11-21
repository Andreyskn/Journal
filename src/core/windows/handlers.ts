import { isDefaultPositions } from './helpers';
import { mutations } from '../mutations';

const setRect: Actions.Handler<
	Pick<Store.Window, 'id'> & Partial<Model.WindowRect>
> = (state, { id, position, width, height }) => {
	return (state as any).updateIn(['windows', id], (window: Store.Window) =>
		window.withMutations((window) => {
			window
				.set('position', position ?? window.position)
				.set('width', width ?? window.width)
				.set('height', height ?? window.height);
		})
	);
};

const bringToFront: Actions.Handler<Pick<Store.Window, 'id'>> = (
	state,
	{ id }
) => {
	return state.update('windowOrder', (order) =>
		order.withMutations((windowOrder) => {
			windowOrder.delete(id).add(id);
		})
	);
};

const open: Actions.Handler<Pick<Store.Window, 'id'>> = (state, { id }) => {
	const window = state.windows.get(id)!.set('status', 'open');
	const topWindow = state.windowOrder.last(null);

	return state.withMutations((state) => {
		(state as any).setIn(['windows', id], window);

		mutations.dispatch({
			type: 'WINDOW_STATUS_CHANGE',
			payload: { state, window },
		});

		bringToFront(state, { id });

		if (
			topWindow &&
			topWindow !== id &&
			isDefaultPositions(window, state.windows.get(topWindow)!)
		) {
			setRect(state, {
				id,
				position: Object.entries(window.position).reduce(
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

const close: Actions.Handler<Pick<Store.Window, 'id'>> = (state, { id }) => {
	const window = state.windows.get(id)!.set('status', 'closed');

	return state.withMutations((state) => {
		(state as any).setIn(['windows', id], window);

		mutations.dispatch({
			type: 'WINDOW_STATUS_CHANGE',
			payload: { state, window },
		});

		state.update('windowOrder', (order) => order.delete(id));
	});
};

const minimize: Actions.Handler<Pick<Store.Window, 'id'>> = (state, { id }) => {
	const window = state.windows.get(id)!.set('status', 'minimized');

	return state.withMutations((state) => {
		(state as any).setIn(['windows', id], window);

		mutations.dispatch({
			type: 'WINDOW_STATUS_CHANGE',
			payload: { state, window },
		});

		state.update('windowOrder', (order) => order.delete(id));
	});
};

const setIsMaximized: Actions.Handler<Pick<
	Store.Window,
	'id' | 'isMaximized'
>> = (state, { id, isMaximized }) => {
	return state.withMutations((state) => {
		(state as any).setIn(['windows', id, 'isMaximized'], isMaximized);
		bringToFront(state, { id });
	});
};

export const handlers = {
	'windows/setRect': setRect,
	'windows/open': open,
	'windows/close': close,
	'windows/minimize': minimize,
	'windows/setIsMaximized': setIsMaximized,
	'windows/bringToFront': bringToFront,
};
