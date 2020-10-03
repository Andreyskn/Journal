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
import { createReducer } from '../utils';

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
	dispatch: Actions.Dispatch<any> = store.dispatch
): R => {
	return useMemo(
		() =>
			(Object.entries(dispatchers) as [keyof T, T[keyof T]][]).reduce(
				(result, [name, fn]) => {
					result[name] = fn({
						dispatch,
						...deps,
					}) as R[keyof T];
					return result;
				},
				{} as R
			),
		Object.values(deps)
	);
};
