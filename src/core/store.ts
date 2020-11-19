import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import {
	getInitialState,
	initPersistance,
	persistanceHandlers,
} from './persistance';
import { initHooks } from './hooks';
import { appHandlers, batchHandlers } from './batching';
import { createReducer } from '../utils';

export let store: Store.Store;

const storeHandlers: Store.Handlers = {
	...appHandlers,
	...persistanceHandlers,
	...batchHandlers,
};

const reducer = createReducer(storeHandlers, getInitialState());

export const initStore = () => {
	store = createStore(reducer, devToolsEnhancer({ name: 'Journal' }));
	initPersistance(store);
	initHooks(store, storeHandlers);
};
