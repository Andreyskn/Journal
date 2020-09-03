type HandlerDeps = {
	taskListId: App.TaskList['id'];
};

type TaskListDispatcher<T extends any[] = []> = Actions.Dispatcher<
	T,
	HandlerDeps
>;

const addTask: TaskListDispatcher<[text: App.Task['text']]> = ({
	dispatch,
	taskListId,
}) => (text) => {
	dispatch({
		type: '@tasks/ADD_TASK',
		payload: {
			taskListId,
			text,
		},
	});
};

const deleteTask: TaskListDispatcher<[taskId: App.Task['id']]> = ({
	dispatch,
	taskListId,
}) => (taskId: App.Task['id']) => {
	dispatch({
		type: '@tasks/DELETE_TASK',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const toggleDone: TaskListDispatcher<[taskId: App.Task['id']]> = ({
	dispatch,
	taskListId,
}) => (taskId: App.Task['id']) => {
	dispatch({
		type: '@tasks/TOGGLE_TASK_DONE',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const renameTaskList: TaskListDispatcher<[title: App.TaskList['title']]> = ({
	dispatch,
	taskListId,
}) => (title: App.TaskList['title']) => {
	dispatch({
		type: '@tasks/SET_TASK_LIST_TITLE',
		payload: {
			taskListId,
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
