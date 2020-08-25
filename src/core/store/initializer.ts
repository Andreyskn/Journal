import Immutable from 'immutable';

import { tasksDefaults } from '../data/tasks';
import { tabsDefaults } from '../tabs';
import { fsDefaults } from '../fileSystem';

const AppStateRecord = Immutable.Record<App.AppState>({
	...tasksDefaults.tasksState,
	...tabsDefaults.tabsState,
	...fsDefaults.fileSystemState,
});

const appStateReviver = (
	key: string,
	value: Immutable.Collection.Keyed<string, any>
) => {
	// const objectType: Maybe<App.RecordTag> = value.get('_tag');

	// switch (objectType) {
	// 	case 'task':
	// 		return TaskRecord(value);
	// 	case 'task-list':
	// 		return TaskListRecord(value);
	// 	case 'tab':
	// 		return TabRecord(value);
	// }

	// switch (key as Maybe<App.ImmutableNonRecordKey>) {
	// 	case '':
	// 		return AppStateRecord(value);
	// 	case 'items':
	// 	case 'tabs':
	// 		return value.toOrderedMap();
	// }

	return value;
};

export const getInitialState = (): App.ImmutableAppState => {
	const savedState = localStorage.getItem('state');

	return savedState
		? Immutable.fromJS(JSON.parse(savedState), appStateReviver as any)
		: AppStateRecord();
};
