import { render as renderImpl } from './components';
import { handlers as handlersImpl } from './handlers';

const TASK_RE = /- \[[x ]\] (.*)/;

const defaultState: Readonly<TaskList.State> = { tasks: [] };

const init: Plugin.Initializer<TaskList.State> = (state) => {
	if (typeof state === 'string') {
		const rawTasks: string[] = [];

		state.split('\n').forEach((line) => {
			const match = TASK_RE.exec(line);
			if (match) {
				rawTasks.push(match[1]);
			}
		});

		return rawTasks.reduce((state, text) => {
			return handlersImpl.addTask(state, { text });
		}, defaultState);
	}

	return state || defaultState;
};

const lazyModule: Plugin.LazyModule = {
	render: renderImpl,
	handlers: handlersImpl,
	initState: init,
};

export const { render, handlers, initState } = lazyModule;
