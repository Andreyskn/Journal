import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { getInitialState } from './initializer';
import { tabsReducer } from './tabs';
import { tasksReducer } from './tasks';
import { activeDocumentReducer } from './activeDocument';

const combinedReducer: Record<keyof AppState, Reducer<any, any>> = {
	tasks: tasksReducer,
	tabs: tabsReducer,
	activeDocument: activeDocumentReducer,
};

const rootReducer = combineReducers(combinedReducer as any, getInitialState);

const devTools = devToolsEnhancer({ name: 'Journal' });

export const store = createStore(
	rootReducer,
	compose(applyMiddleware(thunk), devTools)
);
