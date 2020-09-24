const init: Plugin.InitStateDispatcher = ({ dispatch }) => (data) => {
	dispatch({
		type: '@tasks/INIT',
		payload: {
			data,
		},
	});
};

const addTask: Actions.Dispatcher<[text: Plugin.Task['text']]> = ({
	dispatch,
}) => (text) => {
	dispatch({
		type: '@tasks/ADD_TASK',
		payload: {
			text,
		},
	});
};

const deleteTask: Actions.Dispatcher<[taskId: Plugin.Task['id']]> = ({
	dispatch,
}) => (taskId) => {
	dispatch({
		type: '@tasks/DELETE_TASK',
		payload: {
			taskId,
		},
	});
};

const toggleDone: Actions.Dispatcher<[taskId: Plugin.Task['id']]> = ({
	dispatch,
}) => (taskId) => {
	dispatch({
		type: '@tasks/TOGGLE_TASK_DONE',
		payload: {
			taskId,
		},
	});
};

const renameTaskList: Actions.Dispatcher<[title: Plugin.TaskList['title']]> = ({
	dispatch,
}) => (title) => {
	dispatch({
		type: '@tasks/SET_TASK_LIST_TITLE',
		payload: {
			title,
		},
	});
};

export const dispatchers = {
	init,
	addTask,
	deleteTask,
	toggleDone,
	renameTaskList,
};

export type TasksDispatch = Actions.DispatcherMap<typeof dispatchers>;
