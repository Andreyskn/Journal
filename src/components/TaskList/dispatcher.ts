import { Dispatch } from 'redux';

export type HandlerDeps = {
	dispatch: Dispatch<Actions.AppAction>;
	taskListId: Store.TaskList['id'];
};

const addTask = ({ dispatch, taskListId }: HandlerDeps) => (
	taskText: Store.Task['text']
) => {
	dispatch<Actions.AddTask>({
		type: '@tasks/ADD_TASK',
		payload: {
			taskListId,
			taskText,
		},
	});
};

const deleteTask = ({ dispatch, taskListId }: HandlerDeps) => (
	taskId: Store.Task['id']
) => {
	dispatch<Actions.DeleteTask>({
		type: '@tasks/DELETE_TASK',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const toggleDone = ({ dispatch, taskListId }: HandlerDeps) => (
	taskId: Store.Task['id']
) => {
	dispatch<Actions.ToggleDoneTaskStatus>({
		type: '@tasks/TOGGLE_DONE',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const renameTaskList = ({ dispatch, taskListId }: HandlerDeps) => (
	title: Store.TaskList['title']
) => {
	dispatch<Actions.RenameTaskList>({
		type: '@tasks/RENAME_TASK_LIST',
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
