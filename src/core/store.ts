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

export let store: App.Store;

let handlers = Object.entries({
	...persistanceHandlers,
	...fileSystem.handlers,
	...tabs.handlers,
}).reduce((acc, [type, handler]) => {
	acc[type] = (state, action) => handler(state, action.payload as any);
	return acc;
}, {} as App.ActionHandlers);

const reducer: Reducer<App.ImmutableAppState, Actions.AppAction> = (
	state = getInitialState(),
	action
) => {
	return (handlers[action.type] || (<T>(s: T) => s))(state, action);
};

export const initStore = () => {
	store = createStore(reducer, devToolsEnhancer({ name: 'Journal' }));
	initPersistance(store);
};

export const addHandlers = (newHandlers: App.ActionHandlers) => {
	handlers = { ...handlers, ...newHandlers };
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
	deps: D = {} as D,
	meta?: Actions.Meta
): R => {
	return useMemo(
		() =>
			(Object.entries(dispatchers) as [keyof T, T[keyof T]][]).reduce(
				(result, [name, fn]) => {
					result[name] = fn({
						dispatch: meta
							? (action: Actions.AppAction) =>
									store.dispatch({ ...action, ...meta })
							: store.dispatch,
						...deps,
					}) as R[keyof T];
					return result;
				},
				{} as R
			),
		Object.values({ ...deps, meta })
	);
};
