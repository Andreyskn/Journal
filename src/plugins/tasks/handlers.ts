import * as helpers from './helpers';
import { actionHandler, identifier } from '../../utils';

type TasksHandler<P extends AnyObject | undefined = undefined> = App.Handler<
	P,
	App.ImmutableTaskList
>;

const setTaskListTitle: TasksHandler<{
	title: App.TaskList['title'];
}> = (state, { title }) => {
	return state.set('title', title);
};

const addTask: TasksHandler<{
	text: App.Task['text'];
}> = (state, { text }) => {
	const newTask = helpers.createTask({
		text,
		id: identifier.generateId('task'),
	});

	return state.update('items', (tasks) => tasks.set(newTask.id, newTask));
};

const deleteTask: TasksHandler<{
	taskId: App.Task['id'];
}> = (state, { taskId }) => {
	return state.update('items', (tasks) => tasks.delete(taskId));
};

const toggleTaskDone: TasksHandler<{
	taskId: App.Task['id'];
}> = (state, { taskId }) => {
	return state.updateIn(['items', taskId], (task) =>
		task.set('done', !task.done)
	);
};

export const tasksHandlers = [
	actionHandler('@tasks/ADD_TASK', addTask),
	actionHandler('@tasks/DELETE_TASK', deleteTask),
	actionHandler('@tasks/TOGGLE_TASK_DONE', toggleTaskDone),
	actionHandler('@tasks/SET_TASK_LIST_TITLE', setTaskListTitle),
];
