export { TaskList as Component } from './components/TaskList';
export { handlers } from './handlers';

export const init: Plugin.Initializer<TaskList.State> = (s) => {
	return s || { tasks: [], title: 'Task List' };
};
