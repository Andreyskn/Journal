import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { tabsReducer } from './tabs';
import { tasksReducer } from './tasks';
import { getInitialState } from './initializer';

const combinedReducer: Record<keyof AppState, Reducer<any, any>> = {
	tasks: tasksReducer,
	tabs: tabsReducer,
};

const rootReducer = combineReducers(combinedReducer as any, getInitialState);

const devTools = devToolsEnhancer({ name: 'Journal' });

export const store = createStore(
	rootReducer,
	compose(applyMiddleware(thunk), devTools)
);
