import { Store as ReduxStore } from 'redux';
import { generateId } from '../../utils';

export type HandlerDeps = {
	store: ReduxStore<Store.ImmutableAppState, Actions.AppAction>;
};

const setActiveFile = ({ store: { dispatch } }: HandlerDeps) => (
	filePath: Store.File['path']['absolute']
) => {
	dispatch<Actions.SetActiveFile>({
		type: '@fs/SET_ACTIVE_FILE',
		payload: filePath,
	});
};

const createFile = ({ store: { dispatch, getState } }: HandlerDeps) => (
	name: string,
	folderPath: Store.Folder['path']
) => {
	const id = generateId();

	dispatch<Actions.AddTaskList>({
		type: '@tasks/ADD_TASK_LIST',
		payload: id,
	});

	dispatch<Actions.CreateFile>({
		type: '@fs/CREATE_FILE',
		payload: {
			type: 'tasks',
			contentPath: ['taskLists', id],
			folderPath,
			name,
		},
	});

	dispatch<Actions.AddTab>({
		type: '@tabs/ADD_TAB',
		payload: getState().activeFilePath!,
	});
};

const createFolder = ({ store: { dispatch } }: HandlerDeps) => (
	name: string,
	parentPath: Store.Folder['path']
) => {
	dispatch<Actions.CreateFolder>({
		type: '@fs/CREATE_FOLDER',
		payload: { name, parentPath },
	});
};

export const createDispatch = (deps: HandlerDeps) => ({
	setActiveFile: setActiveFile(deps),
	createFile: createFile(deps),
	createFolder: createFolder(deps),
});

export type FileTreeDispatch = ReturnType<typeof createDispatch>;
