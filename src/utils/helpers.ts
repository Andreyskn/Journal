import { useReducer, useRef } from 'react';

export const useForceUpdate = () => {
	const [, forceUpdate] = useReducer((s) => s + 1, 0);
	return { forceUpdate };
};

export const useStateRef = <S>(initialState: S) => {
	const { forceUpdate } = useForceUpdate();
	const state = useRef(initialState);
	const changeRef = useRef(false);

	const getState = () => state.current;

	const setState = (nextState: S) => {
		state.current = nextState;
		changeRef.current = true;
		forceUpdate();
	};

	const hasChanged = () => changeRef.current;

	return [state.current, setState, { getState, hasChanged }] as const;
};

export const actionHandler = <
	T extends string,
	H extends App.Handler<any, any>
>(
	type: T,
	handler: H
) => {
	return [
		type,
		(
			state: Parameters<H>[0],
			action: App.ActionBase<T, Parameters<H>[1]>
		) => handler(state, (action as App.ActionBase<T, unknown>).payload),
	] as const;
};

export const initDispatchers = <
	T extends Record<string, Actions.Dispatcher<any[], any>>,
	D extends Actions.DispatcherDeps<T>,
	R extends Actions.DispatcherMap<T>
>(
	dispatch: Actions.Dispatch,
	dispatchers: T,
	deps: D = {} as D,
	meta?: Actions.Meta
): R =>
	(Object.entries(dispatchers) as [keyof T, T[keyof T]][]).reduce(
		(result, [name, fn]) => {
			result[name] = fn({
				dispatch: meta
					? (action: Actions.AppAction) =>
							dispatch({ ...action, ...meta })
					: dispatch,
				...deps,
			}) as R[keyof T];
			return result;
		},
		{} as R
	);

export const debounce = <T extends (...args: any[]) => void>(
	fn: T,
	delay: number
) => {
	let timeout: ReturnType<typeof setTimeout>;

	return ((...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	}) as T;
};
