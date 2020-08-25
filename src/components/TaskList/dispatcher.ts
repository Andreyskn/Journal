import { Dispatch } from 'redux';

export type HandlerDeps = {
	dispatch: Dispatch<Actions.AppAction>;
	taskListId: App.TaskList['id'];
};

const addTask = ({ dispatch, taskListId }: HandlerDeps) => (
	text: App.Task['text']
) => {
	dispatch({
		type: '@tasks/ADD_TASK',
		payload: {
			taskListId,
			text,
		},
	});
};

const deleteTask = ({ dispatch, taskListId }: HandlerDeps) => (
	taskId: App.Task['id']
) => {
	dispatch({
		type: '@tasks/DELETE_TASK',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const toggleDone = ({ dispatch, taskListId }: HandlerDeps) => (
	taskId: App.Task['id']
) => {
	dispatch({
		type: '@tasks/TOGGLE_TASK_DONE',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const renameTaskList = ({ dispatch, taskListId }: HandlerDeps) => (
	title: App.TaskList['title']
) => {
	dispatch({
		type: '@tasks/SET_TASK_LIST_TITLE',
		payload: {
			taskListId,
			title,
		},
	});
};

export const createDispatch = (deps: HandlerDeps) => ({
	addTask: addTask(deps),
	deleteTask: deleteTask(deps),
	toggleDone: toggleDone(deps),
	renameTaskList: renameTaskList(deps),
});

export type TasksDispatch = ReturnType<typeof createDispatch>;
