import Immutable from 'immutable';
import { createTab } from './helpers';

export const state: Store.TabsState = {
	tabs: Immutable.OrderedMap(),
};

export const reviver: Store.Reviver = (tag, key, value) => {
	switch (tag) {
		case 'tab':
			return createTab(value);
	}

	switch (key) {
		case 'tabs':
			return value.toOrderedMap();
	}
};
