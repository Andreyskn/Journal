type AddTask = Action<'@tasks/ADD', string>;
type ToggleDoneTaskStatus = Action<'@tasks/TOGGLE_DONE', number>;

declare global {
	type TaskAction = AddTask | ToggleDoneTaskStatus;
}

export function action(
	type: AddTask['type'],
	payload: AddTask['payload']
): AddTask;
export function action(
	type: ToggleDoneTaskStatus['type'],
	payload: ToggleDoneTaskStatus['payload']
): ToggleDoneTaskStatus;
export function action(
	type: TaskAction['type'],
	payload: TaskAction['payload']
) {
	return { type, payload };
}
