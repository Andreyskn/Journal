import { PATH_DELIMITER } from './constants';
import { useReducer } from 'react';

export const generateId = () => {
	return Date.now().toString(36);
};

export const isFolderPath = (path: string) => path.endsWith(PATH_DELIMITER);

export const useForceUpdate = () => {
	const [, forceUpdate] = useReducer(s => s + 1, 0);
	return { forceUpdate };
};
