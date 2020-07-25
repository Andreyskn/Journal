import Immutable from 'immutable';

import { defaultTasksState, TaskRecord, TaskListRecord } from './tasks';
import { defaultTabsState, TabRecord } from './tabs';

const AppStateRecord = Immutable.Record<AppState>({
	...defaultTasksState,
	...defaultTabsState,
});

const appStateReviver = (
	key: string,
	value: Immutable.Collection.Keyed<string, any>
) => {
	const objectType: Maybe<RecordType> = value.get('_type');

	switch (objectType) {
		case 'task':
			return TaskRecord(value);
		case 'task-list':
			return TaskListRecord(value);
		case 'tab':
			return TabRecord(value);
	}

	switch (key as Maybe<Immutable_Non_Record_Key>) {
		case '':
			return AppStateRecord(value);
		case 'taskLists':
			return value.toOrderedMap();
		case 'items':
		case 'tabsList':
			return value.toOrderedMap();
	}

	return value;
};

export const getInitialState = (): ImmutableAppState => {
	const savedState = localStorage.getItem('state');

	return savedState
		? Immutable.fromJS(JSON.parse(savedState), appStateReviver as any)
		: AppStateRecord();
};
