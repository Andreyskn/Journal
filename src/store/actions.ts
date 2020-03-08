import { Dispatch } from 'redux';

type AddTask = Action<'@tasks/ADD_TASK', Task['text']>;
type DeleteTask = Action<'@tasks/DELETE_TASK', Task['timestamp']>;
type ToggleDoneTaskStatus = Action<'@tasks/TOGGLE_DONE', Task['timestamp']>;
type RenameTaskList = Action<'@tasks/RENAME_LIST', TaskList['title']>;

type AddTab = Action<'@tabs/ADD_TAB'>;

declare global {
	type TaskDispatch = Dispatch<TaskAction>;

	type TaskAction =
		| AddTask
		| DeleteTask
		| ToggleDoneTaskStatus
		| RenameTaskList;

	type TabDispatch = Dispatch<TabAction>;

	type TabAction = AddTab;

	type AppAction = TaskAction | TabAction;
}

export function action(
	type: AddTask['type'],
	payload: AddTask['payload']
): AddTask;
export function action(
	type: DeleteTask['type'],
	payload: DeleteTask['payload']
): DeleteTask;
export function action(
	type: ToggleDoneTaskStatus['type'],
	payload: ToggleDoneTaskStatus['payload']
): ToggleDoneTaskStatus;
export function action(
	type: RenameTaskList['type'],
	payload: RenameTaskList['payload']
): RenameTaskList;
export function action(
	type: AddTab['type']
): // payload: AddTab['payload']
AddTab;
export function action(type: string, payload: any = undefined) {
	return payload !== undefined ? { type, payload } : { type };
}
