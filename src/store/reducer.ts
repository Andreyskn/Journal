import { Reducer } from 'redux';
import { Record, OrderedMap } from 'immutable';

const initialState = Record<AppState>({
	tasks: OrderedMap(),
})();

export const reducer: Reducer<ImmutableAppState, TaskAction> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case '@tasks/ADD': {
			const newTask = Record<Task>({
				timestamp: Date.now(),
				text: action.payload,
				done: false,
			})();

			return state.updateIn(['tasks'], tasks =>
				tasks.set(newTask.timestamp, newTask)
			);
		}

		case '@tasks/TOGGLE_DONE': {
			return state.updateIn(['tasks', action.payload], task =>
				task.update('done', done => !done)
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
