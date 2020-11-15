import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { useEffect, useMemo, useState } from 'react';

import {
	getInitialState,
	initPersistance,
	persistanceHandlers,
} from './persistance';
import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { windows } from './windows';
import { createReducer } from '../utils';

export let store: Store.Store;

const coreHandlers = {
	...persistanceHandlers,
	...fileSystem.handlers,
	...tabs.handlers,
	...windows.handlers,
};

const reducer = createReducer(coreHandlers, getInitialState());

export const initStore = () => {
	store = createStore(reducer, devToolsEnhancer({ name: 'Journal' }));
	initPersistance(store);
};

export const useSelector = <T extends any>(
	select: (state: Store.State) => T
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

const actionCreatorsCache = new Map<
	Actions.HandlersMap,
	Actions.ActionCreatorsMap<any>
>();

const getActionCreators = <
	T extends AnyObject,
	R extends Actions.ActionCreatorsMap<T>
>(
	handlers: T
) => {
	const match = actionCreatorsCache.get(handlers);
	if (match) return match as R;

	const actionCreators = (Object.keys(handlers) as (keyof R)[]).reduce(
		(result, type) => {
			const dispatcher: Actions.ActionCreator<any> = (dispatch) => (
				payload
			) => {
				dispatch({ type, payload });
			};
			result[type] = dispatcher as any;
			return result;
		},
		{} as R
	);

	actionCreatorsCache.set(handlers, actionCreators);
	return actionCreators;
};

const ACTION_TYPE_RE = /^@(?<category>.+)\/(?<name>.*)/;

type ActionTypeExec = Maybe<
	OmitType<RegExpExecArray, 'groups'> & {
		groups: {
			category?: string;
			name: string;
		};
	}
>;

export const createDispatch = <T extends Actions.ActionCreatorsMap<any>>(
	dispatch: Actions.BaseDispatch<any>,
	actionCreators: T
) =>
	(Object.keys(actionCreators) as (string & keyof T)[]).reduce(
		(result, type) => {
			const match = ACTION_TYPE_RE.exec(type) as ActionTypeExec;

			if (match && match.groups.category) {
				const {
					groups: { category, name },
				} = match;
				(result[category] ||= {})[name] = actionCreators[type](
					dispatch
				);
			} else {
				result[type] = actionCreators[type](dispatch);
			}

			return result;
		},
		{} as AnyObject
	) as Actions.Dispatch<T>;

type UseDispatchOptions = {
	dispatch: Actions.BaseDispatch<any>;
	handlers: Actions.HandlersMap;
};

let coreDispatch: Store.Dispatch;

interface UseDispatch {
	(): { dispatch: Store.Dispatch };
	<T extends UseDispatchOptions>(options: T): {
		dispatch: Actions.Dispatch<T['handlers']>;
	};
}

export const useDispatch: UseDispatch = <T extends UseDispatchOptions>(
	options?: T
) => {
	if (!options) {
		coreDispatch ||= createDispatch(
			store.dispatch,
			getActionCreators(coreHandlers)
		) as any;
		return { dispatch: coreDispatch };
	}

	const { dispatch, handlers } = options;

	return (useMemo(
		() => ({
			dispatch: createDispatch(dispatch, getActionCreators(handlers)),
		}),
		[]
	) as Actions.Dispatch<T['handlers']>) as any;
};
