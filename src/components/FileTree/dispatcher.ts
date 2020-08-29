import { Store as ReduxStore } from 'redux';

export type HandlerDeps = {
	store: ReduxStore<App.ImmutableAppState, Actions.AppAction>;
};

const setActiveFile = ({ store: { dispatch } }: HandlerDeps) => (
	id: App.File['id']
) => {
	dispatch({
		type: '@fs/SET_ACTIVE_FILE',
		payload: { id },
	});
};

const createFile = ({ store: { dispatch } }: HandlerDeps) => (
	name: string,
	parent: App.RegularFile['parent']
) => {
	dispatch({
		type: '@fs/CREATE_FILE',
		payload: {
			name,
			parent,
		},
	});
};

const deleteFile = ({ store: { dispatch } }: HandlerDeps) => (
	id: App.File['id']
) => {
	dispatch({
		type: '@fs/DELETE_FILE',
		payload: { id },
	});
};

const renameFile = ({ store: { dispatch } }: HandlerDeps) => (
	id: App.File['id'],
	name: App.File['name']
) => {
	dispatch({
		type: '@fs/RENAME_FILE',
		payload: { id, name },
	});
};

export const createDispatch = (deps: HandlerDeps) => ({
	setActiveFile: setActiveFile(deps),
	createFile: createFile(deps),
	deleteFile: deleteFile(deps),
	renameFile: renameFile(deps),
});

export type FileTreeDispatch = ReturnType<typeof createDispatch>;
