import { TasksHandlers } from './reducer';

declare global {
	namespace Actions {
		type AddTask = Store.Action<TasksHandlers, '@tasks/ADD_TASK'>;
		type DeleteTask = Store.Action<TasksHandlers, '@tasks/DELETE_TASK'>;
		type ToggleDoneTaskStatus = Store.Action<
			TasksHandlers,
			'@tasks/TOGGLE_DONE'
		>;
		type RenameTaskList = Store.Action<
			TasksHandlers,
			'@tasks/RENAME_TASK_LIST'
		>;
		type AddTaskList = Store.Action<TasksHandlers, '@tasks/ADD_TASK_LIST'>;

		type TaskAction =
			| AddTask
			| DeleteTask
			| ToggleDoneTaskStatus
			| RenameTaskList
			| AddTaskList;
	}
}
