import * as helpers from './helpers';
import { generateId } from '../../utils';
import { DIRECTORY_ID, UNTITLED } from './constants';
import { mutations } from '../mutations';
import { PLUGINS_MAP } from '../../plugins';

mutations.on({
	type: 'SET_ACTIVE_FILE',
	act: ({ state, id }) => {
		setActiveFile(state, { id });
	},
});

const createFile: App.Handler<{
	name: App.File['name'];
	parent: App.RegularFile['parent'];
}> = (state, { name, parent }) => {
	return state.withMutations((state) => {
		let newFile: App.ImmutableFile;
		const type = helpers.getFileType(name);
		const path = helpers.getFilePath(state.files, name, parent);

		if (type === 'directory') {
			newFile = helpers.createDirectory({ name, parent, path });
		} else {
			const fileData: App.FileData = {
				id: generateId(),
				state: null,
			};

			newFile = helpers.createFile({
				name,
				path,
				type,
				parent,
				data: fileData.id,
			});

			state.update('data', (data) => data.set(fileData.id, fileData));
			state.update('activeFile', (activeFile) => ({
				...activeFile,
				id: newFile.id,
				path,
			}));
		}

		state.update('files', (files) => files.set(newFile.id, newFile));
		helpers.setDirectoryData(state, parent, newFile);

		mutations.dispatch({
			type: 'FILE_CREATED',
			payload: { state, file: newFile },
		});
	});
};

const createUntitledFile: App.Handler<{ type: App.RegularFile['type'] }> = (
	state,
	{ type }
) => {
	const extension = PLUGINS_MAP[type].extension;
	let name = `${UNTITLED}${extension}`;

	const siblingFileNames = (state.files.get(
		DIRECTORY_ID.main
	) as App.Directory).data
		.keySeq()
		.map((name) => name.toLowerCase())
		.toSet();

	for (let i = 1; siblingFileNames.has(name.toLowerCase()); i++) {
		name = `${UNTITLED}_${i}${extension}`;
	}

	return createFile(state, { name, parent: DIRECTORY_ID.main });
};

const deleteFile: App.Handler<{
	id: App.File['id'];
}> = (state, { id }) => {
	const targetFile = state.files.get(id);

	if (!targetFile) return state;

	return state.withMutations((state) => {
		if (helpers.isDirectory(targetFile)) {
			targetFile.data.forEach((id) => deleteFile(state, { id }));
		} else {
			state.update('data', (data) =>
				data.delete((targetFile as App.RegularFile).data)
			);
		}

		state.updateIn(
			['files', targetFile.parent, 'data'],
			(data: App.Directory['data']) => data.delete(targetFile.name)
		);

		state.update('files', (files) => files.delete(id));

		if (state.activeFile.id === id) {
			state.update('activeFile', (activeFile) => ({
				...activeFile,
				id: null,
				path: null,
			}));
		}

		mutations.dispatch({
			type: 'FILE_DELETED',
			payload: { state, file: targetFile },
		});
	});
};

const renameFile: App.Handler<{
	id: App.File['id'];
	name: App.File['name'];
}> = (state, { id, name }) => {
	return moveFile(state, { id, newName: name });
};

const moveFile: App.Handler<{
	id: App.File['id'];
	newName?: string;
	newDir?: App.File['parent'];
}> = (state, { id, newName, newDir }) => {
	const file = state.files.get(id);

	if (!file) return state;

	const name = newName || file.name;
	const dest = newDir || file.parent;

	// TODO: handle name collisions
	return state.withMutations((state) => {
		(state as any).updateIn(
			['files', file.parent, 'data'],
			(data: App.Directory['data']) => data.delete(file.name)
		);

		// TODO: add updateFile function (should handle activeFile too)
		(state as any).updateIn(['files', id], (file: App.ImmutableFile) =>
			file.withMutations((file) => {
				file.set('name', name)
					.set('parent', dest)
					.set('path', helpers.getFilePath(state.files, name, dest));
			})
		);

		const updatedFile = state.files.get(id)!;

		// TODO: active file should store a reference to file instead of id and path
		if (updatedFile.id === state.activeFile.id) {
			state.update('activeFile', (activeFile) => ({
				...activeFile,
				path: updatedFile.path,
			}));
		}

		helpers.setDirectoryData(state, dest, updatedFile);

		mutations.dispatch({
			type: 'FILE_UPDATED',
			payload: { state, file: updatedFile },
		});
	});
};

const setActiveFile: App.Handler<{
	id: App.FileSystemState['activeFile']['id'];
}> = (state, { id }) => {
	if (!id)
		return state.update('activeFile', (activeFile) => ({
			...activeFile,
			id: null,
			path: null,
		}));

	return state.withMutations((state) => {
		const file = state.files.get(id)!;

		state.update('activeFile', (activeFile) => ({
			...activeFile,
			id,
			path: file.path,
		}));

		mutations.dispatch({
			type: 'FILE_SELECTED',
			payload: { state, file },
		});
	});
};

const setFileDataState: App.Handler<{
	id: App.File['id'];
	dataState: App.FileData['state'];
}> = (state, { id, dataState }) => {
	return (state as any).updateIn(['data', id], (data: App.FileData) => ({
		...data,
		state: dataState,
	}));
};

export const handlers = {
	'@fs/CREATE_FILE': createFile,
	'@fs/CREATE_UNTITLED_FILE': createUntitledFile,
	'@fs/DELETE_FILE': deleteFile,
	'@fs/RENAME_FILE': renameFile,
	'@fs/MOVE_FILE': moveFile,
	'@fs/SET_ACTIVE_FILE': setActiveFile,
	'@fs/SET_FILE_DATA_STATE': setFileDataState,
};
