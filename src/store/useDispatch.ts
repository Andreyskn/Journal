import { useDispatch as useReduxDispatch } from 'react-redux';

import { tasksActions } from './tasks/actions';
import { tabsActions } from './tabs/actions';
import { activeDocumentActions } from './activeDocument/actions';

const thunksMap = new Map<Thunks, Thunks>();

const getThunks = <T extends Thunks>(dispatch: ThunkDispatch, thunks: T) => {
	const existingThunks = thunksMap.get(thunks);
	if (existingThunks) return existingThunks as T;

	const withDispatch = <F extends AnyFunction>(func: F) =>
		((...args: any[]) => {
			dispatch(func(...args));
		}) as F;

	const wrappedThunks = (Object.entries(thunks) as [
		keyof T,
		T[keyof T]
	][]).reduce((result, [thunkName, thunkBody]) => {
		result[thunkName] = withDispatch(thunkBody);
		return result;
	}, {} as T);

	return wrappedThunks;
};

export const useDispatch = (): Dispatch => {
	const _dispatch = useReduxDispatch();

	return {
		tabsAction: getThunks(_dispatch, tabsActions),
		tasksAction: getThunks(_dispatch, tasksActions),
		activeDocumentAction: getThunks(_dispatch, activeDocumentActions),
	};
};
