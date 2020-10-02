const addTask: TaskList.Dispatcher<[text: TaskList.Task['text']]> = ({
	dispatch,
}) => (text) => {
	dispatch({
		type: 'ADD_TASK',
		payload: {
			text,
		},
	});
};

const deleteTask: TaskList.Dispatcher<[taskId: TaskList.Task['id']]> = ({
	dispatch,
}) => (taskId) => {
	dispatch({
		type: 'DELETE_TASK',
		payload: {
			taskId,
		},
	});
};

const toggleDone: TaskList.Dispatcher<[taskId: TaskList.Task['id']]> = ({
	dispatch,
}) => (taskId) => {
	dispatch({
		type: 'TOGGLE_TASK_DONE',
		payload: {
			taskId,
		},
	});
};

const renameTaskList: TaskList.Dispatcher<[title: TaskList.State['title']]> = ({
	dispatch,
}) => (title) => {
	dispatch({
		type: 'SET_TASK_LIST_TITLE',
		payload: {
			title,
		},
	});
};

export const dispatchers = {
	addTask,
	deleteTask,
	toggleDone,
	renameTaskList,
};
