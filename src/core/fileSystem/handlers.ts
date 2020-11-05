import * as helpers from './helpers';
import { generateId } from '../../utils';
import { DIRECTORY_ID, UNTITLED } from './constants';
import { mutations, Mutations } from '../mutations';
import { PLUGINS_MAP } from '../../plugins';

mutations
	.on({
		type: 'SET_ACTIVE_FILE',
		act: ({ state, id }) => {
			setActiveFile(state, { id });
		},
	})
	.on({
		type: 'FILE_CREATED',
		act: ({ state, file }) => {
			if (helpers.isRegularFile(file)) {
				setActiveFile(state, { id: file.id });
			}
		},
	})
	.on({
		type: 'FILE_UPDATED',
		act: ({ state, file: { id, isTrashed } }) => {
			if (id === state.activeFile.ref?.id) {
				setActiveFile(state, { id: isTrashed ? null : id });
			}
		},
	});

const createFile: App.Handler<{
	name: App.File['name'];
	parent: App.RegularFile['parent'];
	symlink?: App.File['id'];
}> = (state, { name, parent, symlink }) => {
	return state.withMutations((state) => {
		let newFile: App.ImmutableFile;
		const type = helpers.getFileType(name);
		const path = helpers.getFilePath(state.files, name, parent);

		if (symlink) {
			newFile = helpers.createSymlink({
				data: symlink,
				name,
				parent,
				path,
			});
		} else if (type === 'directory') {
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
	const targetFile = state.files.get(id)!;

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

		mutations.dispatch({
			type: 'FILE_DELETED',
			payload: { state, file: targetFile },
		});
	});
};

const updateFile: App.Handler<{
	id: App.File['id'];
	newName?: App.File['name'];
	newParent?: App.File['parent'];
	isTrashed?: boolean;
}> = (state, { id, newName, newParent, isTrashed = false }) => {
	const file: App.ImmutableFile = state.getIn(['files', id]);
	const name = newName || file.name;
	const parent = newParent || file.parent;

	const updatedFile = file.withMutations((file) => {
		file.set('name', name)
			.set('parent', parent)
			.set('path', helpers.getFilePath(state.files, name, parent))
			.set('lastModifiedAt', Date.now())
			.set('isTrashed', isTrashed);
	});

	return state.withMutations((state) => {
		(state as any).setIn(['files', id], updatedFile);

		if (helpers.isDirectory(file)) {
			file.data.forEach((id) => updateFile(state, { id, isTrashed }));
		}

		mutations.dispatch({
			type: 'FILE_UPDATED',
			payload: { state, file: updatedFile },
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
	newParent?: App.File['parent'];
}> = (state, { id, newName, newParent }) => {
	const file = state.files.get(id)!;

	return state.withMutations((state) => {
		(state as any).updateIn(
			['files', file.parent, 'data'],
			(data: App.Directory['data']) => data.delete(file.name)
		);

		updateFile(state, { id, newName, newParent });

		const updatedFile = state.files.get(id)!;
		const { name, parent } = updatedFile;

		// Replace file in case of name collision
		const fileToReplace = (state.files.get(
			parent!
		) as App.ImmutableDirectory).data.get(name);
		if (fileToReplace) deleteFile(state, { id: fileToReplace });

		helpers.setDirectoryData(state, parent, updatedFile);
	});
};

const moveToTrash: App.Handler<{
	id: App.File['id'];
}> = (state, { id }) => {
	const { name } = state.files.get(id)!;

	return state.withMutations((state) => {
		updateFile(state, { id, isTrashed: true });
		createFile(state, {
			name: name,
			parent: DIRECTORY_ID.trash,
			symlink: id,
		});
	});
};

const setActiveFile: App.Handler<{
	id: App.ActiveFileId;
}> = (state, { id }) => {
	if (!id) {
		return state.set('activeFile', helpers.createActiveFile());
	}

	return state.withMutations((state) => {
		const file = state.files.get(id) as App.ImmutableRegularFile;

		state.set(
			'activeFile',
			helpers.createActiveFile({
				ref: file,
			})
		);

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
	'@fs/createFile': createFile,
	'@fs/createUntitledFile': createUntitledFile,
	'@fs/deleteFile': deleteFile,
	'@fs/moveToTrash': moveToTrash,
	'@fs/renameFile': renameFile,
	'@fs/moveFile': moveFile,
	'@fs/setActiveFile': setActiveFile,
	'@fs/setFileDataState': setFileDataState,
};
