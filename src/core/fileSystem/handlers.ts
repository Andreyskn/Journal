import * as helpers from './helpers';
import { actionHandler, identifier } from '../../utils';
import { DIRECTORY_ID, UNTITLED } from './constants';
import { mutations } from '../mutations';
import { plugins } from '../pluginManager';

export const createFile: App.Handler<{
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
			const newData = plugins
				.get(type)!
				.init({ id: identifier.generateId(type) });

			newFile = helpers.createFile({
				name,
				path,
				type,
				parent,
				data: newData.id,
			});

			state.update('data', (data) => data.set(newData.id, newData));
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
	const extension = plugins.get(type)!.extension;
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

	if (
		!targetFile ||
		!targetFile.parent ||
		!state.files.get(targetFile.parent)
	) {
		return state;
	}

	return state.withMutations((state) => {
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
	const originalFile = state.files.get(id);
	if (!originalFile) return state;

	const renamedFile = originalFile.set('name', name);

	return state.withMutations((state) => {
		state.update('files', (files) =>
			files.set(renamedFile.id, renamedFile)
		);
		(state as any).updateIn(
			['files', originalFile.parent, 'data'],
			(data: App.Directory['data']) => data.delete(originalFile.name)
		);
		helpers.setDirectoryData(state, renamedFile.parent, renamedFile);

		mutations.dispatch({
			type: 'FILE_UPDATED',
			payload: { state, file: renamedFile },
		});
	});
};

const setActiveFile: App.Handler<{
	id: App.File['id'];
}> = (state, { id }) => {
	return state.update('activeFile', (activeFile) => ({
		...activeFile,
		id,
		path: state.files.get(id)!.path,
	}));
};

export const fileSystemHandlers = [
	actionHandler('@fs/CREATE_FILE', createFile),
	actionHandler('@fs/CREATE_UNTITLED_FILE', createUntitledFile),
	actionHandler('@fs/DELETE_FILE', deleteFile),
	actionHandler('@fs/RENAME_FILE', renameFile),
	actionHandler('@fs/SET_ACTIVE_FILE', setActiveFile),
];
