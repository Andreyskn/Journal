import Immutable from 'immutable';

import { TasksStateRecord, TaskRecord, TaskListRecord } from './tasks';
import { TabsStateRecord, TabRecord } from './tabs';
import { ActiveDocumentRecord } from './activeDocument';

const AppStateRecord = Immutable.Record<AppState>({
	tasks: TasksStateRecord(),
	tabs: TabsStateRecord(),
	activeDocument: ActiveDocumentRecord(),
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
		case 'tasks-state':
			return TasksStateRecord(value);
		case 'tabs-state':
			return TabsStateRecord(value);
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

export const getInitialState = () => {
	const savedState = localStorage.getItem('state');

	return savedState
		? Immutable.fromJS(JSON.parse(savedState), appStateReviver as any)
		: AppStateRecord();
};
