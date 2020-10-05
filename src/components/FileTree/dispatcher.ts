const setActiveFile: Actions.Dispatcher<[id: App.File['id']]> = ({
	dispatch,
}) => (id) => {
	dispatch({
		type: '@fs/SET_ACTIVE_FILE',
		payload: { id },
	});
};

const createFile: Actions.Dispatcher<[
	name: string,
	parent: App.RegularFile['parent']
]> = ({ dispatch }) => (name, parent) => {
	dispatch({
		type: '@fs/CREATE_FILE',
		payload: {
			name,
			parent,
		},
	});
};

const deleteFile: Actions.Dispatcher<[id: App.File['id']]> = ({ dispatch }) => (
	id
) => {
	dispatch({
		type: '@fs/DELETE_FILE',
		payload: { id },
	});
};

const renameFile: Actions.Dispatcher<[
	id: App.File['id'],
	name: App.File['name']
]> = ({ dispatch }) => (id, name) => {
	dispatch({
		type: '@fs/RENAME_FILE',
		payload: { id, name },
	});
};

const moveFile: Actions.Dispatcher<[
	id: App.File['id'],
	newDir: App.File['parent']
]> = ({ dispatch }) => (id, newDir) => {
	dispatch({
		type: '@fs/MOVE_FILE',
		payload: { id, newDir },
	});
};

export const dispatchers = {
	setActiveFile,
	createFile,
	deleteFile,
	renameFile,
	moveFile,
};

export type FileTreeDispatch = Actions.DispatcherMap<typeof dispatchers>;
