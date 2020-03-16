import { Reducer } from 'redux';
import Immutable from 'immutable';

export const TaskListRecord = Immutable.Record<TypedTaskList>({
	_type: 'task-list',
	id: 0,
	tasks: Immutable.OrderedMap(),
	title: 'Task List',
});

export const TaskRecord = Immutable.Record<TypedTask>({
	_type: 'task',
	timestamp: 0,
	text: '',
	done: false,
});

export const TabRecord = Immutable.Record<TypedTab>({
	_type: 'tab',
	id: 0,
	contentId: 0,
	contentType: 'taskLists',
});

export const AppStateRecord = Immutable.Record<AppState>({
	taskLists: Immutable.Map([['0', TaskListRecord()]]),
	tabs: Immutable.OrderedMap([['0', TabRecord()]]),
	activeTabId: 0,
});

const appStateReviver = (
	key: string | number,
	value: Immutable.Collection.Keyed<string, any>
) => {
	switch (key) {
		case '':
			return AppStateRecord(value);
		case 'taskLists':
			return value.toMap();
		case 'tasks':
		case 'tabs':
			return value.toOrderedMap();
	}

	switch (value.get('_type')) {
		case 'task':
			return TaskRecord(value);
		case 'task-list':
			return TaskListRecord(value);
		case 'tab':
			return TabRecord(value);
	}

	throw Error();
};

const getInitialState = () => {
	const savedState = localStorage.getItem('state');

	const a = savedState
		? Immutable.fromJS(JSON.parse(savedState), appStateReviver as any)
		: AppStateRecord();

	console.log(!!savedState, a, a.toJS());

	return a;
};

export const reducer: Reducer<ImmutableAppState, AppAction> = (
	state = getInitialState(),
	action
) => {
	switch (action.type) {
		case '@tasks/ADD_TASK': {
			const timestamp = Date.now();

			return state.updateIn(['taskLists', 0, 'tasks'], tasks =>
				tasks.set(
					timestamp.toString(),
					TaskRecord({ text: action.payload, timestamp })
				)
			);
		}

		case '@tasks/TOGGLE_DONE': {
			return state.updateIn(
				['taskLists', 0, 'tasks', action.payload],
				task => task.update('done', done => !done)
			);
		}

		case '@tasks/DELETE_TASK': {
			return state.updateIn(['taskLists', 0, 'tasks'], tasks =>
				tasks.delete(action.payload.toString())
			);
		}

		case '@tasks/RENAME_LIST': {
			return state.updateIn(['taskLists', 0], taskList =>
				taskList.set('title', action.payload)
			);
		}

		case '@tabs/ADD_TAB': {
			const id = Date.now();
			return state.updateIn(['tabs'], tabs =>
				tabs.set(
					id.toString(),
					TabRecord({ contentType: 'taskLists', id, contentId: 1 })
				)
			);
		}

		default: {
			if (process.env.NODE_ENV === 'development') {
				const unhandled: never = action;
			}
			return state;
		}
	}
};
