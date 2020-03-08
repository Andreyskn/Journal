import { Record, OrderedMap, Map } from 'immutable';

type TaskListsKey = KeyOf<TasksState, 'taskLists'>;
type TasksKey = KeyOf<TaskList, 'tasks'>;

declare global {
	type Task = {
		timestamp: number;
		text: string;
		done: boolean;
	};

	type ImmutableTask = Record<Task>;

	type TaskList = {
		id: number;
		title: string;
		tasks: OrderedMap<Task['timestamp'], ImmutableTask>;
	};

	type ImmutableTaskList = Record<TaskList>;

	type TasksState = {
		taskLists: Map<TaskList['id'], ImmutableTaskList>;
	};

	interface ImmutableAppState {
		updateIn(
			keyPath: [TaskListsKey],
			updater: Updater<TasksState['taskLists']>
		): ImmutableAppState;
		updateIn(
			keyPath: [TaskListsKey, TaskList['id']],
			updater: Updater<ImmutableTaskList>
		): ImmutableAppState;
		updateIn(
			keyPath: [TaskListsKey, TaskList['id'], TasksKey],
			updater: Updater<TaskList['tasks']>
		): ImmutableAppState;
		updateIn(
			keyPath: [
				TaskListsKey,
				TaskList['id'],
				TasksKey,
				Task['timestamp']
			],
			updater: Updater<ImmutableTask>
		): ImmutableAppState;
	}
}
