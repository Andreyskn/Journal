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
	id: TaskList.Task['id'];
}> = (state, { id }) => {
	return {
		...state,
		tasks: state.tasks.filter((t) => t.id !== id),
	};
};

const toggleTaskDone: TaskList.Handler<{
	id: TaskList.Task['id'];
}> = (state, { id }) => {
	return {
		...state,
		tasks: state.tasks.map((t) =>
			t.id === id ? { ...t, done: !t.done } : t
		),
	};
};

export const handlers = {
	addTask,
	deleteTask,
	toggleTaskDone,
	setTaskListTitle,
};
