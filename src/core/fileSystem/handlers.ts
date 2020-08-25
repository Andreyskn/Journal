import * as helpers from './helpers';
import { actionHandler } from '../../utils';
import { DIRECTORY_ID, UNTITLED, EXTENSION_BY_TYPE } from './constants';
import { mutations } from '../mutations';

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
			mutations.dispatch({
				type: 'CREATE_DATA_ENTRY',
				payload: { state, type },
			});

			newFile = helpers.createFile({
				name,
				path,
				type,
				parent,
				data: state.data.last<undefined>()!.id,
			});
		}

		state.update('files', (files) => files.set(newFile.id, newFile));
		state.updateIn(
			['files', parent, 'data'],
			(data: App.Directory['data']) =>
				data.set(newFile.name, newFile.id).sortBy(
					(id, name) => ({
						name,
						isDirectory: Number(
							(state.files.get(id) || newFile).type ===
								'directory'
						),
					}),
					(a, b) =>
						b.isDirectory - a.isDirectory ||
						a.name.localeCompare(b.name)
				)
		);
		state.update('activeFile', (activeFile) => ({
			...activeFile,
			id: newFile.id,
			path,
		}));

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
	const extension = EXTENSION_BY_TYPE[type];
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

		// mutations.onFileDelete(state, targetFile);
	});
};

const renameFile: App.Handler = (state) => {
	return state;
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
