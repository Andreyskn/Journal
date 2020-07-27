import { Dispatch } from 'redux';

export type HandlerDeps = {
	dispatch: Dispatch<Model.AppAction>;
	taskListId: Model.TaskList['id'];
};

const addTask = ({ dispatch, taskListId }: HandlerDeps) => (
	taskText: Model.Task['text']
) => {
	dispatch<AddTask>({
		type: '@tasks/ADD_TASK',
		payload: {
			taskListId,
			taskText,
		},
	});
};

const deleteTask = ({ dispatch, taskListId }: HandlerDeps) => (
	taskId: Model.Task['id']
) => {
	dispatch<DeleteTask>({
		type: '@tasks/DELETE_TASK',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const toggleDone = ({ dispatch, taskListId }: HandlerDeps) => (
	taskId: Model.Task['id']
) => {
	dispatch<ToggleDoneTaskStatus>({
		type: '@tasks/TOGGLE_DONE',
		payload: {
			taskListId,
			taskId,
		},
	});
};

const renameTaskList = ({ dispatch, taskListId }: HandlerDeps) => (
	title: Model.TaskList['title']
) => {
	dispatch<RenameTaskList>({
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
