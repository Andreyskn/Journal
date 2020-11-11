import { render as renderImpl } from './components';
import { handlers as handlersImpl } from './handlers';

const init: Plugin.Initializer<Notes.State> = (state) => {
	if (state && typeof state !== 'string') return state;
	return { text: state || '', layout: 'split' };
};

const lazyModule: Plugin.LazyModule = {
	render: renderImpl,
	handlers: handlersImpl,
	initState: init,
};

export const { render, handlers, initState } = lazyModule;
