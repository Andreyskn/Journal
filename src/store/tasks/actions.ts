export {};

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

declare global {
	type TaskAction =
		| AddTask
		| DeleteTask
		| ToggleDoneTaskStatus
		| RenameTaskList
		| AddTaskList;

	interface Dispatch {
		// tasksAction(type: AddTask['type'], payload: AddTask['payload']): void;
		// tasksAction(
		// 	type: DeleteTask['type'],
		// 	payload: DeleteTask['payload']
		// ): void;
		// tasksAction(
		// 	type: ToggleDoneTaskStatus['type'],
		// 	payload: ToggleDoneTaskStatus['payload']
		// ): void;
		// tasksAction(
		// 	type: RenameTaskList['type'],
		// 	payload: RenameTaskList['payload']
		// ): void;
		// tasksAction(
		// 	type: AddTaskList['type'],
		// 	payload: AddTaskList['payload']
		// ): void;
	}
}
