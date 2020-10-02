export { TaskList as Component } from './components/TaskList';
export { dispatchers } from './dispatcher';
export { handlers } from './handlers';

export const init: Plugin.Initializer<TaskList.State> = (s) => {
	return s || { tasks: [], title: 'Task List' };
};
