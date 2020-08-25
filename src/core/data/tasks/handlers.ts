import * as helpers from './helpers';
import { actionHandler, identifier } from '../../../utils';
import { mutations } from '../../mutations';

mutations.on({
	type: 'CREATE_DATA_ENTRY',
	act: ({ state, type }) => {
		if (type === 'tasks') {
			createTaskList(state);
		}
	},
});

export const createTaskList: App.Handler = (state) => {
	return state.withMutations((state) => {
		const newTaskList = helpers.createTaskList({
			id: identifier.generateId('task-list'),
		});
		state.update('data', (data) => data.set(newTaskList.id, newTaskList));
	});
};

const setTaskListTitle: App.Handler<{
	taskListId: App.TaskList['id'];
	title: App.TaskList['title'];
}> = (state, { taskListId, title }) => {
	return state.updateIn(['data', taskListId], (taskList) =>
		taskList.set('title', title)
	);
};

const addTask: App.Handler<{
	taskListId: App.TaskList['id'];
	text: App.Task['text'];
}> = (state, { taskListId, text }) => {
	const newTask = helpers.createTask({
		text,
		id: identifier.generateId('task'),
	});

	return state.updateIn(['data', taskListId, 'items'], (tasks) =>
		tasks.set(newTask.id, newTask)
	);
};

const deleteTask: App.Handler<{
	taskListId: App.TaskList['id'];
	taskId: App.Task['id'];
}> = (state, { taskListId, taskId }) => {
	return state.updateIn(['data', taskListId, 'items'], (tasks) =>
		tasks.delete(taskId)
	);
};

const toggleTaskDone: App.Handler<{
	taskListId: App.TaskList['id'];
	taskId: App.Task['id'];
}> = (state, { taskListId, taskId }) => {
	return state.updateIn(['data', taskListId, 'items', taskId], (task) =>
		task.update('done', (done) => !done)
	);
};

export const tasksHandlers = [
	actionHandler('@tasks/ADD_TASK', addTask),
	actionHandler('@tasks/DELETE_TASK', deleteTask),
	actionHandler('@tasks/TOGGLE_TASK_DONE', toggleTaskDone),
	actionHandler('@tasks/CREATE_TASK_LIST', createTaskList),
	actionHandler('@tasks/SET_TASK_LIST_TITLE', setTaskListTitle),
];
