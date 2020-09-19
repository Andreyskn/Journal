import { useReducer } from 'react';

export const useForceUpdate = () => {
	const [, forceUpdate] = useReducer((s) => s + 1, 0);
	return { forceUpdate };
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

// TODO: introduce some kind of a race for unload handling
export const debounce = <T extends (...args: any[]) => void>(
	fn: T,
	delay: number
) => {
	let timeout: ReturnType<typeof setTimeout>;
	let callback: () => void;

	return ((...args: Parameters<T>) => {
		clearTimeout(timeout);
		window.removeEventListener('beforeunload', callback);

		callback = () => fn(...args);
		window.addEventListener('beforeunload', callback);

		timeout = setTimeout(() => {
			callback();
			window.removeEventListener('beforeunload', callback);
		}, delay);
	}) as T;
};

// export const debounceRace
