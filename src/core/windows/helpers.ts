import Immutable from 'immutable';

const defaultPosition: Position = { top: 10, left: 10 };

export const createWindow = Immutable.Record<Store.TaggedRecords['Window']>({
	__tag: 'window',
	id: '',
	position: defaultPosition,
	width: 600,
	height: 300,
	status: process.env.NODE_ENV === 'development' ? 'minimized' : 'closed',
});

export const isDefaultPositions = (w1: Store.Window, w2: Store.Window) => {
	return w1.position === defaultPosition && w2.position === defaultPosition;
};
