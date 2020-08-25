import Immutable from 'immutable';
import { tasksHandlers } from './handlers';

type DataKey = KeyOf<App.TasksState, 'data'>;
type TaskListItemsKey = KeyOf<App.TaskList, 'items'>;

declare global {
	namespace Actions {
		type TasksAction = ExtractActions<typeof tasksHandlers[number]>;
	}

	namespace App {
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

		type TasksData = Immutable.Map<TaskList['id'], ImmutableTaskList>;

		type TasksState = {
			data: Immutable.Map<TaskList['id'], ImmutableTaskList>;
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

		type TasksImmutableNonRecordKey = TaskListItemsKey;

		interface PathTo {
			taskList: [DataKey, TaskList['id']];
			tasksListItems: [DataKey, TaskList['id'], TaskListItemsKey];
			task: [DataKey, TaskList['id'], TaskListItemsKey, Task['id']];
		}
	}
}
