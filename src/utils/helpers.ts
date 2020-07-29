import { useReducer } from 'react';

export const generateId = () => {
	return Date.now().toString(36);
};

export const useForceRender = () => {
	const [, forceRender] = useReducer(s => s + 1, 0);
	return { forceRender };
};
