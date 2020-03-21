import Immutable from 'immutable';

type TaskListsKey = KeyOf<TasksState, 'taskLists'>;
type TasksKey = KeyOf<TaskList, 'tasks'>;

type Task_Id_String = Stringified<Task['timestamp']>;
type Task_List_Id_String = Stringified<TaskList['id']>;

declare global {
	type Task = {
		timestamp: number;
		text: string;
		done: boolean;
	};

	type TypedTask = TypedRecord<Task, 'task'>;

	type ImmutableTask = Immutable.Record<TypedTask>;

	type TaskList = {
		id: number;
		title: string;
		tasks: Immutable.OrderedMap<Task_Id_String, ImmutableTask>;
	};

	type TypedTaskList = TypedRecord<TaskList, 'task-list'>;

	type ImmutableTaskList = Immutable.Record<TypedTaskList>;

	type TasksState = {
		taskLists: Immutable.Map<Task_List_Id_String, ImmutableTaskList>;
	};

	type TypedTasksState = TypedRecord<TasksState, 'tasks-state'>;

	type Tasks_Immutable_Non_Record_Key = TaskListsKey | TasksKey;

	interface ImmutableTasksState
		extends OmitType<Immutable.Record<TypedTasksState>, 'updateIn'> {
		updateIn(
			keyPath: [TaskListsKey],
			updater: Updater<TasksState['taskLists']>
		): ImmutableAppState;
		updateIn(
			keyPath: [TaskListsKey, Task_List_Id_String],
			updater: Updater<ImmutableTaskList>
		): ImmutableAppState;
		updateIn(
			keyPath: [TaskListsKey, Task_List_Id_String, TasksKey],
			updater: Updater<TaskList['tasks']>
		): ImmutableAppState;
		updateIn(
			keyPath: [
				TaskListsKey,
				Task_List_Id_String,
				TasksKey,
				Task_Id_String
			],
			updater: Updater<ImmutableTask>
		): ImmutableAppState;
	}
}
