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

export const TasksStateRecord = Immutable.Record<TypedTasksState>({
	_type: 'tasks-state',
	taskLists: Immutable.Map([['0', TaskListRecord()]]),
});

// @ts-ignore FIXME:
export const tasksReducer: Reducer<ImmutableTasksState, TaskAction> = (
	state,
	action
) => {
	switch (action.type) {
		case '@tasks/ADD_TASK': {
			const timestamp = Date.now();

			return state.updateIn(['taskLists', '0', 'tasks'], tasks =>
				tasks.set(
					timestamp.toString(),
					TaskRecord({ text: action.payload, timestamp })
				)
			);
		}

		case '@tasks/TOGGLE_DONE': {
			return state.updateIn(
				['taskLists', '0', 'tasks', action.payload.toString()],
				task => task.update('done', (done: boolean) => !done)
			);
		}

		case '@tasks/DELETE_TASK': {
			return state.updateIn(['taskLists', '0', 'tasks'], tasks =>
				tasks.delete(action.payload.toString())
			);
		}

		case '@tasks/RENAME_LIST': {
			return state.updateIn(['taskLists', '0'], taskList =>
				taskList.set('title', action.payload)
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
