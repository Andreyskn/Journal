import { render as renderImpl } from './components';
import { handlers as handlersImpl } from './handlers';

const init: Plugin.Initializer<Notes.State> = (s) => {
	return s || { text: '' };
};

const lazyModule: Plugin.LazyModule = {
	render: renderImpl,
	handlers: handlersImpl,
	initState: init,
};

export const { render, handlers, initState } = lazyModule;
