import { createStore, Reducer } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { useEffect, useMemo, useState } from 'react';

import {
	getInitialState,
	initPersistance,
	persistanceHandlers,
} from './persistance';
import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { createReducer, initDispatchers } from '../utils';

export let store: App.Store;

const reducer = createReducer(
	{
		...persistanceHandlers,
		...fileSystem.handlers,
		...tabs.handlers,
	},
	getInitialState()
);

export const initStore = () => {
	store = createStore(reducer, devToolsEnhancer({ name: 'Journal' }));
	initPersistance(store);
};

export const useSelector = <T extends any>(
	select: (state: App.ImmutableAppState) => T
) => {
	const [data, setData] = useState(() => select(store.getState()));

	useEffect(
		() =>
			store.subscribe(() => {
				setData(select(store.getState()));
			}),
		[]
	);

	return data;
};

// TODO: combine useDispatch with initDispatchers, add option to replace store.dispatch
export const useDispatch = <
	T extends Record<string, Actions.Dispatcher<any[], any>>,
	D extends Actions.DispatcherDeps<T>,
	R extends Actions.DispatcherMap<T>
>(
	dispatchers: T,
	deps: D = {} as D
): R => {
	return useMemo(
		() => initDispatchers(store.dispatch, dispatchers, deps),
		Object.values(deps)
	);
};
