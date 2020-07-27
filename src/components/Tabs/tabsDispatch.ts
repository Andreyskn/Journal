import { Store } from 'redux';
import { generateId } from '../../utils';

export type HandlerDeps = {
	store: Store<Model.ImmutableAppState, Model.AppAction>;
};

const addTab = ({ store: { dispatch, getState } }: HandlerDeps) => () => {
	/*
	1. create task list
	2. create file
	3. create tab
	*/

	const id = generateId();

	dispatch<AddTaskList>({ type: '@tasks/ADD_TASK_LIST', payload: id });

	dispatch<CreateFile>({
		type: '@fs/CREATE_FILE',
		payload: {
			name: 'Untitled',
			type: 'tasks',
			contentPath: ['taskLists', id],
		},
	});

	dispatch<AddTab>({
		type: '@tabs/ADD_TAB',
		payload: getState().activeFilePath!,
	});
};

const setActiveTab = ({ store }: HandlerDeps) => (
	filePath: Model.Tab['filePath']
) => {};

export const createDispatch = (deps: HandlerDeps) => ({
	addTab: addTab(deps),
	setActiveTab: setActiveTab(deps),
});

export type TabsDispatch = ReturnType<typeof createDispatch>;
