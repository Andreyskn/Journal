import Immutable from 'immutable';

type TaskListsKey = KeyOf<TasksState, 'taskLists'>;
type TaskListItemsKey = KeyOf<TaskList, 'items'>;

declare global {
	type Task = {
		id: string;
		createdAt: Timestamp;
		text: string;
		done: boolean;
	};

	type TypedTask = TypedRecord<Task, 'task'>;

	type ImmutableTask = ImmutableRecord<TypedTask>;

	type TaskList = {
		id: string;
		title: string;
		items: Immutable.OrderedMap<Task['id'], ImmutableTask>;
	};

	type TypedTaskList = TypedRecord<TaskList, 'task-list'>;

	type ImmutableTaskList = ImmutableRecord<TypedTaskList>;

	type TasksState = {
		taskLists: Immutable.Map<TaskList['id'], ImmutableTaskList>;
	};

	type TypedTasksState = TypedRecord<TasksState, 'tasks-state'>;

	type Tasks_Immutable_Non_Record_Key = TaskListsKey | TaskListItemsKey;

	type TasksPath = {
		toTaskLists: [TaskListsKey];
		toTaskList: [TaskListsKey, TaskList['id']];
		toTasksListItems: [TaskListsKey, TaskList['id'], TaskListItemsKey];
		toTask: [TaskListsKey, TaskList['id'], TaskListItemsKey, Task['id']];
	};

	interface ImmutableTasksState
		extends OmitType<ImmutableRecord<TypedTasksState>, 'updateIn'> {
		updateIn(
			keyPath: TasksPath['toTaskLists'],
			updater: Updater<TasksState['taskLists']>
		): ImmutableTasksState;
		updateIn(
			keyPath: TasksPath['toTaskList'],
			updater: Updater<ImmutableTaskList>
		): ImmutableTasksState;
		updateIn(
			keyPath: TasksPath['toTasksListItems'],
			updater: Updater<TaskList['items']>
		): ImmutableTasksState;
		updateIn(
			keyPath: TasksPath['toTask'],
			updater: Updater<ImmutableTask>
		): ImmutableTasksState;
	}
}
