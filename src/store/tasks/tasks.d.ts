import Immutable from 'immutable';

type TaskListsKey = KeyOf<Store.TasksState, 'taskLists'>;
type TaskListItemsKey = KeyOf<Store.TaskList, 'items'>;

declare global {
	namespace Store {
		type Task = {
			id: string;
			createdAt: Timestamp;
			text: string;
			done: boolean;
		};
		type TaggedTask = TaggedRecord<Task, 'task'>;
		type ImmutableTask = ImmutableRecord<TaggedTask>;

		type TaskList = {
			id: string;
			title: string;
			items: Immutable.OrderedMap<Task['id'], ImmutableTask>;
		};
		type TaggedTaskList = TaggedRecord<TaskList, 'task-list'>;
		type ImmutableTaskList = ImmutableRecord<TaggedTaskList>;

		type TasksState = {
			taskLists: Immutable.Map<TaskList['id'], ImmutableTaskList>;
		};

		interface ImmutableAppState {
			getIn(path: PathTo['taskList']): ImmutableTaskList;
			updateIn(
				path: PathTo['taskList'],
				updater: Updater<ImmutableTaskList>
			): ImmutableAppState;
			updateIn(
				path: PathTo['tasksListItems'],
				updater: Updater<TaskList['items']>
			): ImmutableAppState;
			updateIn(
				path: PathTo['task'],
				updater: Updater<ImmutableTask>
			): ImmutableAppState;
		}

		type TasksImmutableNonRecordKey = TaskListsKey | TaskListItemsKey;

		interface PathTo {
			taskList: [TaskListsKey, TaskList['id']];
			tasksListItems: [TaskListsKey, TaskList['id'], TaskListItemsKey];
			task: [TaskListsKey, TaskList['id'], TaskListItemsKey, Task['id']];
		}
	}
}
