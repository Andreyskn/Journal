const setStatus: App.Handler<{
	id: App.Window['id'];
	status: App.Window['status'];
}> = (state, { id, status }) => {
	return (state as any).updateIn(
		['windows', id],
		(window: App.ImmutableWindow) => window.set('status', status)
	);
};

const setRect: App.Handler<{
	id: App.Window['id'];
	position?: App.Window['position'];
	width?: App.Window['width'];
	height?: App.Window['height'];
}> = (state, { id, position, width, height }) => {
	return (state as any).updateIn(
		['windows', id],
		(window: App.ImmutableWindow) =>
			window.withMutations((window) => {
				window
					.set('position', position ?? window.position)
					.set('width', width ?? window.width)
					.set('height', height ?? window.height);
			})
	);
};

const bringToFront: App.Handler<{
	id: App.Window['id'];
}> = (state, { id }) => {
	const { status } = state.windows.get(id)!;
	const isHidden = status === 'closed' || status === 'minimized';

	return (state as any).updateIn(
		['windows', id],
		(window: App.ImmutableWindow) =>
			window.set('status', isHidden ? 'open' : status)
	);
};

export const handlers = {
	'@windows/setStatus': setStatus,
	'@windows/setRect': setRect,
	'@windows/bringToFront': bringToFront,
};
