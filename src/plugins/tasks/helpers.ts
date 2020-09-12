import Immutable from 'immutable';
import { identifier } from '../../utils';

export const createTaskList = Immutable.Record<App.TaggedTaskList>({
	_tag: 'task-list',
	id: identifier.generateId('task-list'),
	items: Immutable.OrderedMap(),
	title: 'Task List',
});

export const createTask = Immutable.Record<App.TaggedTask>({
	_tag: 'task',
	id: identifier.generateId('task'),
	createdAt: 0,
	text: '',
	done: false,
});
