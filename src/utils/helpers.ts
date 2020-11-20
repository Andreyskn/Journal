import { FC, useReducer, useRef } from 'react';

export const noop: AnyFunction = () => {};

export const Null: FC = () => null;

export const userSelect = {
	disable: () => {
		document.body.classList.add('disable-selection');
	},
	enable: () => {
		document.body.classList.remove('disable-selection');
	},
};

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

export const createReducer = <T>(handlers: any, initialState?: T) => {
	const wrappedHandlers = Object.entries(handlers).reduce(
		(acc, [type, handler]) => {
			acc[type] = (state, action) =>
				(handler as any)(state, action.payload);
			return acc;
		},
		{} as Record<string, (state: T, action: any) => T>
	);

	const reducer = (state = initialState, action: any) => {
		return (wrappedHandlers[action.type] || (<T>(s: T) => s))(
			state as any,
			action
		);
	};

	return reducer;
};

export const mergeExcluding = <T extends AnyObject, K extends keyof any>(
	o1: T,
	o2: T,
	exclude: Partial<Record<K, boolean>>
): T => {
	const keysToExclude = Object.keys(exclude).filter(
		(key) => exclude[key as K]
	);
	return [...Object.entries(o1), ...Object.entries(o2)].reduce(
		(result, [key, value]) => {
			if (!keysToExclude.includes(key)) result[key as keyof T] = value;
			return result;
		},
		{} as T
	);
};

export const toViewportUnits = (
	value: Pixels,
	axis: 'x' | 'y'
): ViewportRelativeUnits => {
	return (
		(value / (axis === 'x' ? window.innerWidth : window.innerHeight)) * 100
	);
};

export const pluralize = (singular: string, count: number) => {
	return count === 1 ? singular : `${singular}s`;
};

export const createSystemActionType = <T extends string>(type: T) => {
	const system: Actions.SystemDispatchCategory = 'system';
	return `${system}/${type}` as Actions.SystemActionType<T>;
};
