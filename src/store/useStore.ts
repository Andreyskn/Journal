import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { getThunks } from './thunks';

export const useStore = () => {
	const _dispatch = useDispatch();

	const dispatchAction = (
		type: AppAction['type'],
		payload: AppAction['payload']
	) => {
		_dispatch({ type, payload });
	};

	const thunk = useMemo(() => getThunks(_dispatch), []);

	const dispatch: Dispatch = {
		// tasksAction: dispatchAction,
		tabsAction: dispatchAction,
		thunk,
	};

	return { dispatch };
};
