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
import { createReducer } from '../utils';

export let store: App.Store;

const coreHandlers = {
	...persistanceHandlers,
	...fileSystem.handlers,
	...tabs.handlers,
};

const reducer = createReducer(coreHandlers, getInitialState());

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

type ActionHandlers = Record<string, App.Handler<any, any>>;

type ActionCreator<T> = (
	dispatch: Actions.Dispatch<any>
) => (payload: T) => void;

type ActionCreators<T extends ActionHandlers> = {
	[K in keyof T]: ActionCreator<Parameters<T[K]>[1]>;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type EnhancedDispatch<T extends ActionHandlers> = UnionToIntersection<{
	[Key in keyof T as 0]: Key extends `@${infer Category}/${infer Name}`
		? { [C in Category]: { [N in Name]: ReturnType<ActionCreators<T>[Key]> } }
		: { [K in Key]: ReturnType<ActionCreators<T>[Key]>}
}[0]>

const actionCreatorsCache = new Map<ActionHandlers, ActionCreators<any>>();

const getActionCreators = <T extends AnyObject, R extends ActionCreators<T>>(
	handlers: T
) => {
	const match = actionCreatorsCache.get(handlers);
	if (match) return match as R;

	const actionCreators = (Object.keys(handlers) as (keyof R)[]).reduce(
		(result, type) => {
			const dispatcher: ActionCreator<any> = (dispatch) => (payload) => {
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

type ActionTypeRegexExec = OmitType<RegExpExecArray, 'groups'> & {
	groups: {
		category?: string;
		name: string;
	};
};

export const createEnhancedDispatch = <T extends ActionCreators<any>>(
	dispatch: Actions.Dispatch<any>,
	actionCreators: T
) =>
	(Object.keys(actionCreators) as (keyof T)[]).reduce((result, type) => {
		const match = ACTION_TYPE_RE.exec(type as string) as ActionTypeRegexExec | null;

		if (match && match.groups.category) {
			const { groups: { category, name } } = match;
			(result[category] ||= {})[name] = actionCreators[type](dispatch);
		} 
		else {
			result[type as string] = actionCreators[type](dispatch)
		}

		return result;
	}, {} as AnyObject) as EnhancedDispatch<T>;

type UseDispatchOptions = {
	dispatch: Actions.Dispatch<any>;
	handlers: ActionHandlers;
};

export type CoreDispatch = EnhancedDispatch<typeof coreHandlers>

let coreDispatch: CoreDispatch;

interface UseEnhancedDispatch {
	(): EnhancedDispatch<typeof coreHandlers>;
	<T extends UseDispatchOptions>(options: T): EnhancedDispatch<T['handlers']>;
}

export const useEnhancedDispatch: UseEnhancedDispatch = <
	T extends UseDispatchOptions
>(
	options?: T
) => {
	if (!options) {
		coreDispatch ||= createEnhancedDispatch(
			store.dispatch,
			getActionCreators(coreHandlers)
		) as any;
		return coreDispatch;
	}

	const { dispatch, handlers } = options;

	return useMemo(
		() => createEnhancedDispatch(dispatch, getActionCreators(handlers)),
		[]
	) as EnhancedDispatch<T['handlers']> as any;
};
