import { createStore, applyMiddleware, compose } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { getInitialState } from './initializer';
import { tabsHandlers } from './tabs';
import { tasksHandlers } from './tasks';
import { fileSystemHandlers } from './fileSystem';

const handlers: AnyHandlers = {
	...tabsHandlers,
	...tasksHandlers,
	...fileSystemHandlers,
};

const devTools = devToolsEnhancer({ name: 'Journal' });

const reducer: Reducer<Model.ImmutableAppState, ActionBase<any, any>> = (
	state,
	action
) => {
	const handler = handlers[action.type] as Handler<any> | undefined;
	return handler ? handler(state, action) : state;
};

export const store = createStore(reducer as any, getInitialState(), devTools);
