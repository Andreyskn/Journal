import Immutable, { isIndexed } from 'immutable';
import { get, set } from 'idb-keyval';

import { actionHandler } from '../../utils';
import { createAppState } from './initializer';
import { createFileRecord } from '../fileSystem';
import { createTab } from '../tabs';
import { createTask, createTaskList } from '../data/tasks';

export const initPersistance = (store: App.Store) => {
	store.subscribe(() => {
		(<any>window).requestIdleCallback(() => {
			set('state', store.getState().toJS());
		});
	});

	get<App.AppState>('state').then((savedState) => {
		store.dispatch({
			type: '@persistance/HYDRATE_STORE',
			payload: { savedState },
		});
	});
};

const hydrateStore: App.Handler<{ savedState?: App.AppState }> = (
	state,
	{ savedState }
) => {
	if (!savedState) return state;

	return Immutable.fromJS(savedState, (key, value) => {
		if (isIndexed(value)) return value.toList();

		const objectTag: Maybe<App.RecordTag> = value.get('_tag');

		switch (objectTag) {
			case 'file':
				return createFileRecord(value);
			case 'task':
				return createTask(value);
			case 'task-list':
				return createTaskList(value);
			case 'tab':
				return createTab(value);
		}

		switch (key as Maybe<App.ImmutableNonRecordKey>) {
			case '':
				return createAppState(value);
			case 'files':
				return value.toMap();
			case 'items':
			case 'tabs':
			case 'data':
				return value.toOrderedMap();
			case 'activeFile':
				return value.toJS();
		}

		return value;
	});
};

export const persistanceHandlers = [
	actionHandler('@persistance/HYDRATE_STORE', hydrateStore),
];

declare global {
	namespace Actions {
		type PersistanceAction = ExtractActions<
			typeof persistanceHandlers[number]
		>;
	}
}
