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
