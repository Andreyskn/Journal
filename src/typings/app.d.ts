import { Record } from 'immutable';

type TasksKey = KeyOf<AppState, 'tasks'>;

declare global {
	type AppState = {
		tasks: TasksState;
	};

	type ImmutableAppState = OmitType<Record<AppState>, 'updateIn'> & {
		updateIn(
			keyPath: [TasksKey],
			updater: (tasks: TasksState) => TasksState
		): ImmutableAppState;
		updateIn(
			keyPath: [TasksKey, Task['timestamp']],
			updater: (tasks: ImmutableTask) => ImmutableTask
		): ImmutableAppState;
	};
}
