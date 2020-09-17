import Immutable from 'immutable';
import { identifier } from '../../utils';

export const createTaskList = Immutable.Record<App.TaskList>({
	id: identifier.generateId('task-list'),
	items: Immutable.OrderedMap(),
	title: 'Task List',
});

export const createTask = Immutable.Record<App.Task>({
	id: identifier.generateId('task'),
	createdAt: 0,
	text: '',
	done: false,
});
