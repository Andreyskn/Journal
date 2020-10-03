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
