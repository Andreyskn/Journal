import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { useEffect, useMemo, useState } from 'react';

import {
	getInitialState,
	initPersistance,
	persistanceHandlers,
} from './persistance';
import { initDispatchers } from '../utils';
import { fileSystem } from './fileSystem';
import { tabs } from './tabs';

export let store: App.Store;

let handlers = Object.fromEntries([
	...persistanceHandlers,
	...fileSystem.handlers,
	...tabs.handlers,
]);

const reducer: App.Reducer<App.ImmutableAppState, any> = (state, action) => {
	const handler = handlers[action.type] as App.Handler<any> | undefined;
	return handler ? handler(state, action) : state;
};

export const initStore = () => {
	store = createStore(
		reducer as any,
		getInitialState(),
		devToolsEnhancer({ name: 'Journal' })
	);
	initPersistance(store);
};

export const addHandlers = (newHandlers: App.ActionHandlers) => {
	handlers = Object.fromEntries(Object.entries(handlers).concat(newHandlers));
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

export const useDispatch = <
	T extends Record<string, Actions.Dispatcher<any[], any>>,
	D extends Actions.DispatcherDeps<T>,
	R extends Actions.DispatcherMap<T>
>(
	dispatchers: T,
	deps: D = {} as D,
	meta?: Actions.Meta
): R => {
	return useMemo(
		() => initDispatchers(store.dispatch, dispatchers, deps, meta),
		Object.values({ ...deps, meta })
	);
};
