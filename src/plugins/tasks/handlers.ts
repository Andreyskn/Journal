import { identifier } from '../../utils';

type TasksHandler<P extends AnyObject | undefined = undefined> = App.Handler<
	P,
	App.TaskList
>;

const setTaskListTitle: TasksHandler<{
	title: App.TaskList['title'];
}> = (state, { title }) => {
	return { ...state, title };
};

const addTask: TasksHandler<{
	text: App.Task['text'];
}> = (state, { text }) => {
	const task: App.Task = {
		createdAt: Date.now(),
		done: false,
		id: identifier.generateId('task'),
		text,
	};

	return {
		...state,
		tasks: [task, ...state.tasks],
	};
};

const deleteTask: TasksHandler<{
	taskId: App.Task['id'];
}> = (state, { taskId }) => {
	return {
		...state,
		tasks: state.tasks.filter((t) => t.id !== taskId),
	};
};

const toggleTaskDone: TasksHandler<{
	taskId: App.Task['id'];
}> = (state, { taskId }) => {
	return {
		...state,
		tasks: state.tasks.map((t) =>
			t.id === taskId ? { ...t, done: !t.done } : t
		),
	};
};

const initState: TasksHandler<{
	data: App.StubFileData;
}> = (_, { data }) => {
	return {
		...data,
		tasks: [],
		title: 'Task List',
	};
};

export const handlers = {
	'@tasks/INIT': initState,
	'@tasks/ADD_TASK': addTask,
	'@tasks/DELETE_TASK': deleteTask,
	'@tasks/TOGGLE_TASK_DONE': toggleTaskDone,
	'@tasks/SET_TASK_LIST_TITLE': setTaskListTitle,
};
