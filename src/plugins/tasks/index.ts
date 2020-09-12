import { dispatchers } from './dispatcher';
import { TaskList } from './components/TaskList';
import { registerPlugin } from '../../core/pluginManager';
import { tasksHandlers } from './handlers';
import { createTaskList } from './helpers';

registerPlugin({
	component: TaskList,
	extension: '.t',
	dispatchers,
	handlers: tasksHandlers as any,
	icon: 'form',
	init: createTaskList,
	label: 'Task List',
	sample: createTaskList(),
	type: 'task-list',
});
