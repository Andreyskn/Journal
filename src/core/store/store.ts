import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { useEffect, useMemo, useState } from 'react';

import { tabsHandlers } from '../tabs';
import { tasksHandlers } from '../data/tasks';
import { fileSystemHandlers } from '../fileSystem';
import { initPersistance, persistanceHandlers } from './persistance';
import { createAppState } from './initializer';

const handlers = Object.fromEntries([
	...persistanceHandlers,
	...tabsHandlers,
	...tasksHandlers,
	...fileSystemHandlers,
]);

const devTools = devToolsEnhancer({ name: 'Journal' });

const reducer: App.Reducer<App.ImmutableAppState, App.ActionBase<any, any>> = (
	state,
	action
) => {
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

type DispatcherDeps<
	T extends Record<string, Actions.Dispatcher<any[], any>>,
	R extends AnyObject = OmitType<Parameters<T[keyof T]>[0], 'dispatch'>
> = keyof R extends never ? never : R;

export const useDispatch = <
	T extends Record<string, Actions.Dispatcher<any[], any>>,
	D extends DispatcherDeps<T>,
	R extends Actions.DispatcherMap<T>
>(
	dispatchers: T,
	deps: D = {} as D
): R => {
	return useMemo(
		() =>
			(Object.entries(dispatchers) as [keyof T, T[keyof T]][]).reduce(
				(result, [name, fn]) => {
					result[name] = fn({
						dispatch: store.dispatch,
						...deps,
					}) as R[keyof T];
					return result;
				},
				{} as R
			),
		Object.values(deps)
	);
};
