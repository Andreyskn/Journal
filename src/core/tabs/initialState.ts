import Immutable from 'immutable';
import { createTab } from './helpers';

export const state: App.TabsState = {
	tabs: Immutable.OrderedMap(),
};

export const reviver: App.StateReviver = (tag, key, value) => {
	switch (tag) {
		case 'tab':
			return createTab(value);
	}

	switch (key) {
		case 'tabs':
			return value.toOrderedMap();
	}
};
