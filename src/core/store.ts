import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import {
	getInitialState,
	initPersistance,
	persistanceHandlers,
} from './persistance';
import { initHooks } from './hooks';
import { appHandlers, batchHandlers } from './batchHandlers';
import { createReducer } from '../utils';

export let store: Store.Store;

const handlers: Store.Handlers = {
	...appHandlers,
	...persistanceHandlers,
	...batchHandlers,
};

const reducer = createReducer(handlers, getInitialState());

export const initStore = () => {
	store = createStore(reducer, devToolsEnhancer({ name: 'Journal' }));
	initPersistance(store);
	initHooks(store, handlers);
};
