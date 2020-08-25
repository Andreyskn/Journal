import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { getInitialState } from './initializer';
import { tabsHandlers } from '../tabs';
import { tasksHandlers } from '../data/tasks';
import { fileSystemHandlers } from '../fileSystem';

const handlers = Object.fromEntries([
	...tabsHandlers,
	...tasksHandlers,
	...fileSystemHandlers,
]);

const devTools = devToolsEnhancer({ name: 'Journal' });

const reducer: App.Reducer<App.ImmutableAppState, App.ActionBase<any, any>> = (
	state,
	action
) => {
	const handler = handlers[action.type] as App.Handler<any> | undefined;
	return handler ? handler(state, action) : state;
};

export const store = createStore(reducer as any, getInitialState(), devTools);
