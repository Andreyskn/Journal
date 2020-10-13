import { render as renderImpl } from './components';
import { handlers as handlersImpl } from './handlers';

const init: Plugin.Initializer<TaskList.State> = (s) => {
	return s || { tasks: [], title: 'Task List' };
};

const lazyModule: Plugin.LazyModule = {
	render: renderImpl,
	handlers: handlersImpl,
	initState: init,
};

export const { render, handlers, initState } = lazyModule;
