export {};

type AddTask = Action<'@tasks/ADD_TASK', Task['text']>;
type DeleteTask = Action<'@tasks/DELETE_TASK', Task['timestamp']>;
type ToggleDoneTaskStatus = Action<'@tasks/TOGGLE_DONE', Task['timestamp']>;
type RenameTaskList = Action<'@tasks/RENAME_LIST', TaskList['title']>;

declare global {
	type TaskAction =
		| AddTask
		| DeleteTask
		| ToggleDoneTaskStatus
		| RenameTaskList;

	interface Dispatch {
		tasksAction(
			type: AddTask['type'],
			payload: AddTask['payload']
		): AddTask;
		tasksAction(
			type: DeleteTask['type'],
			payload: DeleteTask['payload']
		): DeleteTask;
		tasksAction(
			type: ToggleDoneTaskStatus['type'],
			payload: ToggleDoneTaskStatus['payload']
		): ToggleDoneTaskStatus;
		tasksAction(
			type: RenameTaskList['type'],
			payload: RenameTaskList['payload']
		): RenameTaskList;
	}
}
