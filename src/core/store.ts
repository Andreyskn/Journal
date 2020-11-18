import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import {
	getInitialState,
	initPersistance,
	persistanceHandlers,
} from './persistance';
import { initHooks } from './hooks';
import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { windows } from './windows';
import { createReducer } from '../utils';

export let store: Store.Store;

const coreHandlers: Store.Handlers = {
	...persistanceHandlers,
	...fileSystem.handlers,
	...tabs.handlers,
	...windows.handlers,
};

const reducer = createReducer(coreHandlers, getInitialState());

export const initStore = () => {
	store = createStore(reducer, devToolsEnhancer({ name: 'Journal' }));
	initPersistance(store);
	initHooks(store, coreHandlers);
};
