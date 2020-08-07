import { Store as ReduxStore } from 'redux';
import { generateId } from '../../utils';

export type HandlerDeps = {
	store: ReduxStore<Store.ImmutableAppState, Actions.AppAction>;
};

const addTab = ({ store: { dispatch, getState } }: HandlerDeps) => () => {
	const id = generateId();

	dispatch<Actions.AddTaskList>({
		type: '@tasks/ADD_TASK_LIST',
		payload: id,
	});

	dispatch<Actions.CreateFile>({
		type: '@fs/CREATE_FILE',
		payload: {
			extension: '.t',
			contentPath: ['taskLists', id],
		},
	});

	dispatch<Actions.AddTab>({
		type: '@tabs/ADD_TAB',
		payload: getState().activeFilePath!,
	});
};

const setActiveTab = ({ store: { dispatch } }: HandlerDeps) => (
	filePath: Store.Tab['filePath']
) => {
	dispatch<Actions.SetActiveFile>({
		type: '@fs/SET_ACTIVE_FILE',
		payload: filePath,
	});
};

export const createDispatch = (deps: HandlerDeps) => ({
	addTab: addTab(deps),
	setActiveTab: setActiveTab(deps),
});

export type TabsDispatch = ReturnType<typeof createDispatch>;
