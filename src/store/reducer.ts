import { Reducer } from 'redux';
import { Record, OrderedMap, Map } from 'immutable';

const createTaskList = Record<TaskList>({
	id: 0,
	tasks: OrderedMap(),
	title: 'Task List',
});

const createTask = Record<Task>({
	timestamp: 0,
	text: '',
	done: false,
});

const createTab = Record<Tab>({
	id: 0,
	contentId: 0,
	contentType: 'taskLists',
});

const initialState = Record<AppState>({
	taskLists: Map([[0, createTaskList()]]),
	tabs: OrderedMap([[0, createTab()]]),
	activeTabId: 0,
})();

export const reducer: Reducer<ImmutableAppState, AppAction> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case '@tasks/ADD_TASK': {
			const timestamp = Date.now();

			return state.updateIn(['taskLists', 0, 'tasks'], tasks =>
				tasks.set(
					timestamp,
					createTask({ text: action.payload, timestamp })
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
				tasks.delete(action.payload)
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
					id,
					createTab({ contentType: 'taskLists', id, contentId: 1 })
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
