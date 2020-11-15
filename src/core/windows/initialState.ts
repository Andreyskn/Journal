import Immutable from 'immutable';
import { createWindow } from './helpers';
import { windowRegistry } from '../../app/Windows/registry';

export const state: Store.WindowsState = {
	windows: Immutable.Map(
		Array.from(windowRegistry.entries()).map(([id, windowModule]) => [
			id,
			createWindow(windowModule),
		])
	),
	windowOrder: Immutable.OrderedSet(),
};

export const reviver: Store.Reviver = (tag, key, value) => {
	switch (tag) {
		case 'window':
			return createWindow(value);
	}

	switch (key) {
		case 'windows':
			return value.toMap();
		case 'windowOrder':
			return value.toOrderedSet();
	}
};
