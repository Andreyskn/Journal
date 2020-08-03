import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { getInitialState } from './initializer';
import { tabsHandlers } from './tabs';
import { tasksHandlers } from './tasks';
import { fileSystemHandlers } from './fileSystem';

const handlers: Store.AnyHandlers = {
	...tabsHandlers,
	...tasksHandlers,
	...fileSystemHandlers,
};

const devTools = devToolsEnhancer({ name: 'Journal' });

const reducer: Store.Reducer<
	Store.ImmutableAppState,
	Store.ActionBase<any, any>
> = (state, action) => {
	const handler = handlers[action.type] as Store.Handler<any> | undefined;
	return handler ? handler(state, action) : state;
};

export const store = createStore(reducer as any, getInitialState(), devTools);
