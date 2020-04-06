import { generateId } from '../../utils';
import { getActiveTaskListId } from '../selectors';

declare global {
	type AddTask = Action<
		'@tasks/ADD_TASK',
		{ taskListId: TaskList['id']; taskText: Task['text'] }
	>;
	type DeleteTask = Action<
		'@tasks/DELETE_TASK',
		{ taskListId: TaskList['id']; taskId: Task['id'] }
	>;
	type ToggleDoneTaskStatus = Action<
		'@tasks/TOGGLE_DONE',
		{ taskListId: TaskList['id']; taskId: Task['id'] }
	>;
	type RenameTaskList = Action<
		'@tasks/RENAME_TASK_LIST',
		{ taskListId: TaskList['id']; title: TaskList['title'] }
	>;
	type AddTaskList = Action<'@tasks/ADD_TASK_LIST', TaskList['id']>;

	type TaskAction =
		| AddTask
		| DeleteTask
		| ToggleDoneTaskStatus
		| RenameTaskList
		| AddTaskList;

	interface Dispatch {
		tasksAction: typeof tasksActions;
	}
}

export const tasksActions = {
	addTaskList: (): ThunkAction => dispatch => {
		const contentId = generateId();
		dispatch<AddTaskList>({
			type: '@tasks/ADD_TASK_LIST',
			payload: contentId,
		});
		dispatch<AddTab>({
			type: '@tabs/ADD_TAB',
			payload: ['tasks', 'taskLists', contentId],
		});
	},

	addTask: (taskText: Task['text']): ThunkAction => (dispatch, getState) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch<AddTask>({
			type: '@tasks/ADD_TASK',
			payload: { taskListId, taskText },
		});
	},

	deleteTask: (taskId: Task['id']): ThunkAction => (dispatch, getState) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch<DeleteTask>({
			type: '@tasks/DELETE_TASK',
			payload: { taskListId, taskId },
		});
	},

	renameTaskList: (title: TaskList['title']): ThunkAction => (
		dispatch,
		getState
	) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch<RenameTaskList>({
			type: '@tasks/RENAME_TASK_LIST',
			payload: { taskListId, title },
		});
	},

	toggleDoneStatus: (taskId: Task['id']): ThunkAction => (
		dispatch,
		getState
	) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch<ToggleDoneTaskStatus>({
			type: '@tasks/TOGGLE_DONE',
			payload: { taskListId, taskId },
		});
	},
};
