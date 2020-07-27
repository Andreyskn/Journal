import Immutable from 'immutable';
import { generateId } from '../../utils';

export const defaultTaskListId = generateId();

export const TaskListRecord = Immutable.Record<Model.TaggedTaskList>({
	_tag: 'task-list',
	id: defaultTaskListId,
	items: Immutable.OrderedMap(),
	title: 'Task List',
});

export const defaultTaskList = TaskListRecord();

export const TaskRecord = Immutable.Record<Model.TaggedTask>({
	_tag: 'task',
	id: '*',
	createdAt: 0,
	text: '*',
	done: false,
});

export const defaultTasksState: Model.TasksState = {
	taskLists: Immutable.OrderedMap([[defaultTaskListId, defaultTaskList]]),
};

const addTask: Handler<{
	taskListId: Model.TaskList['id'];
	taskText: Model.Task['text'];
}> = (state, action) => {
	const { taskListId, taskText } = action.payload;
	const taskId = generateId();

	return state.updateIn(['taskLists', taskListId, 'items'], tasks =>
		tasks.set(
			taskId,
			TaskRecord({
				text: taskText,
				createdAt: Date.now(),
				id: taskId,
			})
		)
	);
};

const toggleDone: Handler<{
	taskListId: Model.TaskList['id'];
	taskId: Model.Task['id'];
}> = (state, action) => {
	const { taskListId, taskId } = action.payload;

	return state.updateIn(['taskLists', taskListId, 'items', taskId], task =>
		task.update('done', done => !done)
	);
};

const deleteTask: Handler<{
	taskListId: Model.TaskList['id'];
	taskId: Model.Task['id'];
}> = (state, action) => {
	const { taskListId, taskId } = action.payload;

	return state.updateIn(['taskLists', taskListId, 'items'], tasks =>
		tasks.delete(taskId)
	);
};

const addTaskList: Handler<Model.TaskList['id']> = (state, action) => {
	const id = action.payload;

	return state.updateIn(['taskLists'], taskLists =>
		taskLists.set(id, TaskListRecord({ id }))
	);
};

const renameTaskList: Handler<{
	taskListId: Model.TaskList['id'];
	title: Model.TaskList['title'];
}> = (state, action) => {
	const { taskListId, title } = action.payload;

	return state.updateIn(['taskLists', taskListId], taskList =>
		taskList.set('title', title)
	);
};

export const tasksHandlers = {
	'@tasks/ADD_TASK': addTask,
	'@tasks/TOGGLE_DONE': toggleDone,
	'@tasks/DELETE_TASK': deleteTask,
	'@tasks/ADD_TASK_LIST': addTaskList,
	'@tasks/RENAME_TASK_LIST': renameTaskList,
};

export type TasksHandlers = typeof tasksHandlers;
