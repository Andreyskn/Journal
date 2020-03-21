import Immutable from 'immutable';

import { TasksStateRecord, TaskRecord, TaskListRecord } from './tasks';
import { TabsStateRecord, TabRecord } from './tabs';

const AppStateRecord = Immutable.Record<AppState>({
	tasks: TasksStateRecord(),
	tabs: TabsStateRecord(),
});

const appStateReviver = (
	key: string,
	value: Immutable.Collection.Keyed<string, any>
) => {
	const objectType: RecordType | undefined = value.get('_type');

	switch (objectType) {
		case 'task':
			return TaskRecord(value);
		case 'task-list':
			return TaskListRecord(value);
		case 'tab':
			return TabRecord(value);
		case 'tasks-state':
			return TasksStateRecord(value);
		case 'tabs-state':
			return TabsStateRecord(value);
	}

	switch (key as Immutable_Non_Record_Key) {
		case '':
			return AppStateRecord(value);
		case 'taskLists':
			return value.toMap();
		case 'tasks':
		case 'tabsList':
			return value.toOrderedMap();
	}
};

export const getInitialState = () => {
	const savedState = localStorage.getItem('state');

	return savedState
		? Immutable.fromJS(JSON.parse(savedState), appStateReviver as any)
		: AppStateRecord();
};
