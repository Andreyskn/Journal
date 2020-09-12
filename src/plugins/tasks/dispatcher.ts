const addTask: Actions.Dispatcher<[text: App.Task['text']]> = ({
	dispatch,
}) => (text) => {
	dispatch({
		type: '@tasks/ADD_TASK',
		payload: {
			text,
		},
	});
};

const deleteTask: Actions.Dispatcher<[taskId: App.Task['id']]> = ({
	dispatch,
}) => (taskId: App.Task['id']) => {
	dispatch({
		type: '@tasks/DELETE_TASK',
		payload: {
			taskId,
		},
	});
};

const toggleDone: Actions.Dispatcher<[taskId: App.Task['id']]> = ({
	dispatch,
}) => (taskId: App.Task['id']) => {
	dispatch({
		type: '@tasks/TOGGLE_TASK_DONE',
		payload: {
			taskId,
		},
	});
};

const renameTaskList: Actions.Dispatcher<[title: App.TaskList['title']]> = ({
	dispatch,
}) => (title: App.TaskList['title']) => {
	dispatch({
		type: '@tasks/SET_TASK_LIST_TITLE',
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

export type TasksDispatch = Actions.DispatcherMap<typeof dispatchers>;
