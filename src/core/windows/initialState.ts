import Immutable from 'immutable';
import { createWindow } from './helpers';
import { windowRegistry } from '../../components/Windows/registry';

export const state: App.WindowsState = {
	windows: Immutable.OrderedMap(
		Array.from(windowRegistry.entries()).map(([id, windowModule]) => [
			id,
			createWindow(windowModule),
		])
	),
};

export const reviver: App.StateReviver = (tag, key, value) => {
	switch (tag) {
		case 'window':
			return createWindow(value);
	}

	switch (key) {
		case 'windows':
			return value.toOrderedMap();
	}
};
