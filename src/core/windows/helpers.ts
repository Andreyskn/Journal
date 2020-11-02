import Immutable from 'immutable';

export const createWindow = Immutable.Record<App.TaggedWindow>({
	_tag: 'window',
	id: '',
	position: { top: 10, left: 10 },
	width: 400,
	height: 300,
	status: 'open',
});
