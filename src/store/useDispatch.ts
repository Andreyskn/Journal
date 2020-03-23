import { useMemo } from 'react';
import { useDispatch as useReduxDispatch } from 'react-redux';

import { getThunks } from './thunks';

export const useDispatch = (): Dispatch => {
	const _dispatch = useReduxDispatch();

	const dispatchAction = (
		type: AppAction['type'],
		payload: AppAction['payload']
	) => {
		_dispatch({ type, payload });
	};

	const thunk = useMemo(() => getThunks(_dispatch), []);

	return {
		// tasksAction: dispatchAction,
		tabsAction: dispatchAction,
		thunk,
	};
};
