import Immutable from 'immutable';

type TaskListsKey = KeyOf<TasksState, 'taskLists'>;
type TasksKey = KeyOf<TaskList, 'tasks'>;

declare global {
	type Task = {
		timestamp: number;
		text: string;
		done: boolean;
	};

	type TypedTask = TypedObject<Task, 'task'>;

	type ImmutableTask = Immutable.Record<TypedTask>;

	type TaskList = {
		id: number;
		title: string;
		tasks: Immutable.OrderedMap<
			Stringified<Task['timestamp']>,
			ImmutableTask
		>;
	};

	type TypedTaskList = TypedObject<TaskList, 'task-list'>;

	type ImmutableTaskList = Immutable.Record<TypedTaskList>;

	type TasksState = {
		taskLists: Immutable.Map<
			Stringified<TaskList['id']>,
			ImmutableTaskList
		>;
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
