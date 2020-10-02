import { generateId } from '../../utils';

const setTaskListTitle: TaskList.Handler<{
	title: TaskList.State['title'];
}> = (state, { title }) => {
	return { ...state, title };
};

const addTask: TaskList.Handler<{
	text: TaskList.Task['text'];
}> = (state, { text }) => {
	const task: TaskList.Task = {
		createdAt: Date.now(),
		done: false,
		id: generateId(),
		text,
	};

	return {
		...state,
		tasks: [task, ...state.tasks],
	};
};

const deleteTask: TaskList.Handler<{
	taskId: TaskList.Task['id'];
}> = (state, { taskId }) => {
	return {
		...state,
		tasks: state.tasks.filter((t) => t.id !== taskId),
	};
};

const toggleTaskDone: TaskList.Handler<{
	taskId: TaskList.Task['id'];
}> = (state, { taskId }) => {
	return {
		...state,
		tasks: state.tasks.map((t) =>
			t.id === taskId ? { ...t, done: !t.done } : t
		),
	};
};

export const handlers = {
	ADD_TASK: addTask,
	DELETE_TASK: deleteTask,
	TOGGLE_TASK_DONE: toggleTaskDone,
	SET_TASK_LIST_TITLE: setTaskListTitle,
};
