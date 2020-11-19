import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { windows } from './windows';
import { getSystemActionType } from '../utils';

export const appHandlers: Store.AppHandlers = {
	...fileSystem.handlers,
	...tabs.handlers,
	...windows.handlers,
};

const batchDispatch: Actions.Handler<{ actions: Store.Action[] }> = (
	state,
	{ actions }
) => {
	return state.withMutations((state) => {
		actions.forEach(({ type, payload }) => {
			//@ts-ignore
			appHandlers[type](state, payload);
		});
	});
};

export const batchHandlers = {
	[getSystemActionType('batchDispatch')]: batchDispatch,
};

declare global {
	namespace Store {
		interface HandlersRegistry {
			Batch: typeof batchHandlers;
		}
	}
}
