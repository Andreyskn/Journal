import { render as renderImpl } from './components';
import { handlers as handlersImpl } from './handlers';

const init: Plugin.Initializer<Questions.State> = (s) => {
	return s || { items: [] };
};

const lazyModule: Plugin.LazyModule = {
	render: renderImpl,
	handlers: handlersImpl,
	initState: init,
};

export const { render, handlers, initState } = lazyModule;
