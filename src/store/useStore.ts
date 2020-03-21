import { Dispatch as ReduxDispatch } from 'redux';
import { useDispatch } from 'react-redux';

declare global {
	interface Dispatch {}
}

export const useStore = () => {
	const _dispatch = useDispatch();

	const action = (type: string, payload: any) => {
		_dispatch(payload === undefined ? { type } : { type, payload });
	};

	// TODO: fix types
	const dispatch: Dispatch = {
		tasksAction: action as any,
		tabsAction: action as any,
	};

	return { dispatch };
};
