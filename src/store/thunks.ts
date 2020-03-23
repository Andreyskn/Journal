import { ThunkDispatch } from 'redux-thunk';

import { generateId } from '../utils';

// TODO: split by state slice, get rid of thunksInstance

const getActiveTaskListId = (state: ImmutableAppState) => {
	const tabsState = state.tabs;
	const activeTab = tabsState.tabsList.get(tabsState.activeTabId)!;
	return state.getIn(activeTab.get('contentPath')).id;
};

const thunks = {
	addTaskList: (): ThunkAction => dispatch => {
		const contentId = generateId();
		dispatch({ type: '@tasks/ADD_TASK_LIST', payload: contentId });
		dispatch({
			type: '@tabs/ADD_TAB',
			payload: ['tasks', 'taskLists', contentId],
		});
	},

	addTask: (taskText: Task['text']): ThunkAction => (dispatch, getState) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch({
			type: '@tasks/ADD_TASK',
			payload: { taskListId, taskText },
		});
	},

	deleteTask: (taskId: Task['id']): ThunkAction => (dispatch, getState) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch({
			type: '@tasks/DELETE_TASK',
			payload: { taskListId, taskId },
		});
	},

	renameTaskList: (title: TaskList['title']): ThunkAction => (
		dispatch,
		getState
	) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch({
			type: '@tasks/RENAME_TASK_LIST',
			payload: { taskListId, title },
		});
	},

	toggleDoneStatus: (taskId: Task['id']): ThunkAction => (
		dispatch,
		getState
	) => {
		const taskListId = getActiveTaskListId(getState());
		dispatch({
			type: '@tasks/TOGGLE_DONE',
			payload: { taskListId, taskId },
		});
	},
};

let thunksInstance: Maybe<Dispatch['thunk']>;

export const getThunks = (
	dispatch: ThunkDispatch<ImmutableAppState, undefined, AppAction>
) => {
	if (thunksInstance) return thunksInstance;

	const withDispatch = <T extends AnyFunction>(func: T) =>
		((...args: any[]) => {
			dispatch(func(...args));
		}) as T;

	thunksInstance = (Object.entries(thunks) as [
		keyof typeof thunks,
		AnyFunction
	][]).reduce((result, [thunkName, thunkBody]) => {
		result[thunkName] = withDispatch(thunkBody);
		return result;
	}, {} as Dispatch['thunk']);

	return thunksInstance;
};

declare global {
	interface Dispatch {
		thunk: typeof thunks;
	}
}
