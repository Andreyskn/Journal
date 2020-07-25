import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { getInitialState } from './initializer';
import { tabsHandlers } from './tabs';
import { tasksHandlers } from './tasks';

const handlers: AnyHandlers = {
	...tabsHandlers,
	...tasksHandlers,
};

const devTools = devToolsEnhancer({ name: 'Journal' });

const reducer: Reducer<ImmutableAppState, ActionBase<any, any>> = (
	state,
	action
) => {
	const handler = handlers[action.type] as Handler<any> | undefined;
	return handler ? handler(state, action) : state;
};

export const store = createStore(
	reducer as any,
	getInitialState(),
	compose(applyMiddleware(thunk), devTools)
);
