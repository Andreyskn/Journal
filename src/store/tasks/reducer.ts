import Immutable from 'immutable';
import { generateId } from '../../utils';

export const defaultTaskListId = generateId();

export const TaskListRecord = Immutable.Record<TypedTaskList>({
	_type: 'task-list',
	id: defaultTaskListId,
	items: Immutable.OrderedMap(),
	title: 'Task List',
});

export const defaultTaskList = TaskListRecord();

export const TaskRecord = Immutable.Record<TypedTask>({
	_type: 'task',
	id: '*',
	createdAt: 0,
	text: '*',
	done: false,
});

export const TasksStateRecord = Immutable.Record<TypedTasksState>({
	_type: 'tasks-state',
	taskLists: Immutable.OrderedMap([[defaultTaskListId, defaultTaskList]]),
});

export const tasksReducer: Reducer<ImmutableTasksState, TaskAction> = (
	tasksState,
	action
) => {
	switch (action.type) {
		case '@tasks/ADD_TASK': {
			const { taskListId, taskText } = action.payload;
			const taskId = generateId();

			return tasksState.updateIn(
				['taskLists', taskListId, 'items'],
				tasks =>
					tasks.set(
						taskId,
						TaskRecord({
							text: taskText,
							createdAt: Date.now(),
							id: taskId,
						})
					)
			);
		}

		case '@tasks/TOGGLE_DONE': {
			const { taskListId, taskId } = action.payload;

			return tasksState.updateIn(
				['taskLists', taskListId, 'items', taskId],
				task => task.update('done', done => !done)
			);
		}

		case '@tasks/DELETE_TASK': {
			const { taskListId, taskId } = action.payload;

			return tasksState.updateIn(
				['taskLists', taskListId, 'items'],
				tasks => tasks.delete(taskId)
			);
		}

		case '@tasks/ADD_TASK_LIST': {
			const id = action.payload;

			return tasksState.updateIn(['taskLists'], taskLists =>
				taskLists.set(id, TaskListRecord({ id }))
			);
		}

		case '@tasks/RENAME_TASK_LIST': {
			const { taskListId, title } = action.payload;

			return tasksState.updateIn(['taskLists', taskListId], taskList =>
				taskList.set('title', title)
			);
		}

		default:
			return tasksState;
	}
};
