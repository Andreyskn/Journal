import Immutable from 'immutable';
import { handlers } from './handlers';

// type DataKey = KeyOf<App.TasksState, 'data'>;
// type TaskListItemsKey = KeyOf<App.TaskList, 'items'>;

declare global {
	namespace App {
		interface PluginRegistry {
			'task-list': Plugin<
				'task-list',
				'.t',
				Actions.ExtractActions<typeof handlers[number]>,
				TaskList | ImmutableTaskList
			>;
		}

		type Task = {
			id: string;
			createdAt: Timestamp;
			text: string;
			done: boolean;
		};
		type ImmutableTask = ImmutableRecord<Task>;

		type TaskList = {
			id: string;
			title: string;
			items: Immutable.OrderedMap<Task['id'], ImmutableTask>;
		};
		type ImmutableTaskList = ImmutableRecord<TaskList>;

		// interface ImmutableAppState {
		// 	getIn(path: PathTo['taskList']): ImmutableTaskList;
		// 	updateIn(
		// 		path: PathTo['taskList'],
		// 		updater: Updater<ImmutableTaskList>
		// 	): ImmutableAppState;
		// 	updateIn(
		// 		path: PathTo['tasksListItems'],
		// 		updater: Updater<TaskList['items']>
		// 	): ImmutableAppState;
		// 	updateIn(
		// 		path: PathTo['task'],
		// 		updater: Updater<ImmutableTask>
		// 	): ImmutableAppState;
		// }

		// type TasksImmutableNonRecordKey = TaskListItemsKey;

		// interface PathTo {
		// 	taskList: [DataKey, TaskList['id']];
		// 	tasksListItems: [DataKey, TaskList['id'], TaskListItemsKey];
		// 	task: [DataKey, TaskList['id'], TaskListItemsKey, Task['id']];
		// }
	}
}
