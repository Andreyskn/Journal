import '../../plugins/tasks';

import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { useEffect, useMemo, useState } from 'react';

import { tabsHandlers } from '../tabs';
import { fileSystemHandlers } from '../fileSystem';
import { initPersistance, persistanceHandlers } from './persistance';
import { createAppState } from './initializer';

import { plugins } from '../pluginManager';
import { initDispatchers } from '../../utils';

const handlers = Object.fromEntries([
	...persistanceHandlers,
	...tabsHandlers,
	...fileSystemHandlers,
	...plugins.handlers,
]);

const devTools = devToolsEnhancer({ name: 'Journal' });

const reducer: App.Reducer<App.ImmutableAppState, any> = (state, action) => {
	const handler = handlers[action.type] as App.Handler<any> | undefined;
	return handler ? handler(state, action) : state;
};

const store = createStore(
	reducer as any,
	createAppState(),
	devTools
) as App.Store;

initPersistance(store);

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

export const dispatch = store.dispatch;

export const useDispatch = <
	T extends Record<string, Actions.Dispatcher<any[], any>>,
	D extends Actions.DispatcherDeps<T>,
	R extends Actions.DispatcherMap<T>
>(
	dispatchers: T,
	deps: D = {} as D
): R => {
	return useMemo(
		() => initDispatchers(dispatch, dispatchers, deps),
		Object.values(deps)
	);
};
