import Immutable from 'immutable';

import { defaultTasksState, TaskRecord, TaskListRecord } from './tasks';
import { defaultTabsState, TabRecord } from './tabs';
import { defaultFileSystemState } from './fileSystem';

const AppStateRecord = Immutable.Record<Store.AppState>({
	...defaultTasksState,
	...defaultTabsState,
	...defaultFileSystemState,
});

const appStateReviver = (
	key: string,
	value: Immutable.Collection.Keyed<string, any>
) => {
	const objectType: Maybe<Store.RecordTag> = value.get('_tag');

	switch (objectType) {
		case 'task':
			return TaskRecord(value);
		case 'task-list':
			return TaskListRecord(value);
		case 'tab':
			return TabRecord(value);
	}

	switch (key as Maybe<Store.ImmutableNonRecordKey>) {
		case '':
			return AppStateRecord(value);
		case 'taskLists':
			return value.toOrderedMap();
		case 'items':
		case 'tabs':
			return value.toOrderedMap();
	}

	return value;
};

export const getInitialState = (): Store.ImmutableAppState => {
	const savedState = localStorage.getItem('state');

	return savedState
		? Immutable.fromJS(JSON.parse(savedState), appStateReviver as any)
		: AppStateRecord();
};
