import { TasksHandlers } from './reducer';

declare global {
	type AddTask = Action<TasksHandlers, '@tasks/ADD_TASK'>;
	type DeleteTask = Action<TasksHandlers, '@tasks/DELETE_TASK'>;
	type ToggleDoneTaskStatus = Action<TasksHandlers, '@tasks/TOGGLE_DONE'>;
	type RenameTaskList = Action<TasksHandlers, '@tasks/RENAME_TASK_LIST'>;
	type AddTaskList = Action<TasksHandlers, '@tasks/ADD_TASK_LIST'>;

	type TaskAction =
		| AddTask
		| DeleteTask
		| ToggleDoneTaskStatus
		| RenameTaskList
		| AddTaskList;
}
