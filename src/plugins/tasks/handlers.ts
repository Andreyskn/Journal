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
		priority: 'medium',
		inProgress: false,
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

const toggleInProgress: TaskList.Handler<{
	id: TaskList.Task['id'];
}> = (state, { id }) => {
	return {
		...state,
		tasks: state.tasks.map((t) =>
			t.id === id ? { ...t, inProgress: !t.inProgress } : t
		),
	};
};

const setTaskPriority: TaskList.Handler<{
	id: TaskList.Task['id'];
	priority: TaskList.Task['priority'];
}> = (state, { id, priority }) => {
	return {
		...state,
		tasks: state.tasks.map((t) => (t.id === id ? { ...t, priority } : t)),
	};
};

const setTaskText: TaskList.Handler<{
	id: TaskList.Task['id'];
	text: TaskList.Task['text'];
}> = (state, { id, text }) => {
	return {
		...state,
		tasks: state.tasks.map((t) => (t.id === id ? { ...t, text } : t)),
	};
};

export const handlers = {
	addTask,
	deleteTask,
	toggleTaskDone,
	setTaskListTitle,
	setTaskPriority,
	setTaskText,
	toggleInProgress,
};
