import { Store } from 'redux';
import { generateId } from '../../utils';

export type HandlerDeps = {
	store: Store<Model.ImmutableAppState, Model.AppAction>;
};

const setActiveFile = ({ store: { dispatch } }: HandlerDeps) => (
	filePath: Model.File['path']['absolute']
) => {
	dispatch<SetActiveFile>({
		type: '@fs/SET_ACTIVE_FILE',
		payload: filePath,
	});
};

const createFile = ({ store: { dispatch, getState } }: HandlerDeps) => (
	name: string,
	folderPath: Model.Folder['path']
) => {
	const id = generateId();

	dispatch<AddTaskList>({ type: '@tasks/ADD_TASK_LIST', payload: id });

	dispatch<CreateFile>({
		type: '@fs/CREATE_FILE',
		payload: {
			type: 'tasks',
			contentPath: ['taskLists', id],
			folderPath,
			name,
		},
	});

	dispatch<AddTab>({
		type: '@tabs/ADD_TAB',
		payload: getState().activeFilePath!,
	});
};

const createFolder = ({ store: { dispatch } }: HandlerDeps) => (
	name: string,
	parentPath: Model.Folder['path']
) => {
	dispatch<CreateFolder>({
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
