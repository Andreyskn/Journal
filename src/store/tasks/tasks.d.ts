import Immutable from 'immutable';

type TaskListsKey = KeyOf<Model.TasksState, 'taskLists'>;
type TaskListItemsKey = KeyOf<Model.TaskList, 'items'>;

declare global {
	namespace Model {
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
			taskLists: Immutable.OrderedMap<TaskList['id'], ImmutableTaskList>;
		};

		type Tasks_Immutable_Non_Record_Key = TaskListsKey | TaskListItemsKey;

		type TasksPath = {
			toTaskLists: [TaskListsKey];
			toTaskList: [TaskListsKey, TaskList['id']];
			toTasksListItems: [TaskListsKey, TaskList['id'], TaskListItemsKey];
			toTask: [
				TaskListsKey,
				TaskList['id'],
				TaskListItemsKey,
				Task['id']
			];
		};

		interface ImmutableAppState {
			getIn(path: TasksPath['toTaskList']): ImmutableTaskList;
			updateIn(
				keyPath: TasksPath['toTaskLists'],
				updater: Updater<TasksState['taskLists']>
			): ImmutableAppState;
			updateIn(
				keyPath: TasksPath['toTaskList'],
				updater: Updater<ImmutableTaskList>
			): ImmutableAppState;
			updateIn(
				keyPath: TasksPath['toTasksListItems'],
				updater: Updater<TaskList['items']>
			): ImmutableAppState;
			updateIn(
				keyPath: TasksPath['toTask'],
				updater: Updater<ImmutableTask>
			): ImmutableAppState;
		}
	}
}
