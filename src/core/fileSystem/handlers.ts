import * as fs from './helpers';
import { DIRECTORY_ID, SEP, UNTITLED } from './constants';
import { mutations } from '../mutations';
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
			if (fs.isRegularFile(file)) {
				setActiveFile(state, { id: file.id });
			}
		},
	})
	.on({
		type: 'FILE_DELETED',
		act: ({ state, file: { id } }) => {
			if (id === state.activeFile.ref?.id) {
				setActiveFile(state, { id: null });
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

interface CreateFile {
	(
		state: Store.State,
		payload: {
			name: Store.Directory['name'];
			type: Store.Directory['type'];
			parent: Store.Directory['parent'];
		}
	): Store.State;
	(
		state: Store.State,
		payload: {
			name: Store.Symlink['name'];
			type: Store.Symlink['type'];
			parent: Store.Symlink['parent'];
			data: Store.Symlink['data'];
		}
	): Store.State;
	(
		state: Store.State,
		payload: {
			name: Store.RegularFile['name'];
			type: Store.RegularFile['type'];
			parent: Store.RegularFile['parent'];
			data?: Store.FileData;
		}
	): Store.State;
	(
		state: Store.State,
		payload: {
			name: Store.File['name'];
			type: Store.File['type'];
			parent: Store.File['parent'];
			data?: Store.Symlink['data'] | Store.FileData;
		}
	): Store.State;
}

const createFile: CreateFile = (
	state: Store.State,
	{
		name,
		type,
		parent,
		data,
	}: {
		name: Store.File['name'];
		type: Store.File['type'];
		parent: Store.File['parent'];
		data?: Store.Symlink['data'] | Store.FileData;
	}
) => {
	return state.withMutations((state) => {
		const path = fs.getFilePath(state.files, name, parent);

		const newFile = ((): Store.File => {
			switch (type) {
				case 'directory': {
					return fs.createDirectory({ name, parent, path });
				}
				case 'symlink': {
					return fs.createSymlink({
						data: data as Store.Symlink['data'],
						name,
						parent,
						path,
					});
				}
				default: {
					const fileData =
						(data as Maybe<Store.FileData>) || fs.createFileData();

					state.update('data', (data) =>
						data.set(fileData.id, fileData)
					);

					return fs.createFile({
						name,
						path,
						type: type as Store.RegularFile['type'],
						parent,
						data: fileData.id,
					});
				}
			}
		})();

		state.update('files', (files) => files.set(newFile.id, newFile));
		fs.setDirectoryData(state, parent, newFile);

		mutations.dispatch({
			type: 'FILE_CREATED',
			payload: { state, file: newFile },
		});
	});
};

const createUntitledFile: Actions.Handler<{
	type: Store.RegularFile['type'];
}> = (state, { type }) => {
	const extension = PLUGINS_MAP[type].extension;
	let name = `${UNTITLED}${extension}`;

	const siblingFileNames = (state.files.get(
		DIRECTORY_ID.main
	) as Store.Directory).data
		.keySeq()
		.map((name) => name.toLowerCase())
		.toSet();

	for (let i = 1; siblingFileNames.has(name.toLowerCase()); i++) {
		name = `${UNTITLED}_${i}${extension}`;
	}

	return createFile(state, { name, type, parent: DIRECTORY_ID.main });
};

const deleteFile: Actions.Handler<{
	id: Store.File['id'];
	isRecursiveCall?: boolean;
}> = (state, { id, isRecursiveCall }) => {
	const target = state.files.get(id)!;

	if (isRecursiveCall && target.isTrashed) return state;

	return state.withMutations((state) => {
		if (fs.isDirectory(target)) {
			target.data.forEach((id) =>
				deleteFile(state, { id, isRecursiveCall: true })
			);
		} else if (fs.isRegularFile(target)) {
			state.update('data', (data) =>
				data.delete((target as Store.RegularFile).data)
			);
		}

		state.updateIn(
			['files', target.parent, 'data'],
			(data: Store.Directory['data']) => data.delete(target.name)
		);

		state.update('files', (files) => files.delete(id));

		mutations.dispatch({
			type: 'FILE_DELETED',
			payload: { state, file: target },
		});
	});
};

const updateFile: Actions.Handler<{
	id: Store.File['id'];
	newName?: Store.File['name'];
	newParent?: Store.File['parent'];
	isTrashed?: boolean;
}> = (state, { id, newName, newParent, isTrashed }) => {
	const file: Store.File = (state as any).getIn(['files', id]);
	const name = newName || file.name;
	const parent = newParent || file.parent;

	const updatedFile = file.withMutations((file: Store.File) => {
		(file as Store.RegularFile)
			.set('name', name)
			.set('parent', parent)
			.set('path', fs.getFilePath(state.files, name, parent))
			.set('lastModifiedAt', Date.now())
			.set('isTrashed', isTrashed ?? file.isTrashed);
	});

	return state.withMutations((state) => {
		(state as any).setIn(['files', id], updatedFile);

		if (fs.isDirectory(file)) {
			file.data.forEach((id) => updateFile(state, { id }));
		}

		mutations.dispatch({
			type: 'FILE_UPDATED',
			payload: { state, file: updatedFile },
		});
	});
};

const renameFile: Actions.Handler<{
	id: Store.File['id'];
	name: Store.File['name'];
}> = (state, { id, name }) => {
	return moveFile(state, { id, newName: name });
};

const moveFile: Actions.Handler<{
	id: Store.File['id'];
	newName?: string;
	newParent?: Store.File['parent'];
	isTrashed?: boolean;
}> = (state, { id, newName, newParent, isTrashed }) => {
	const file = state.files.get(id)!;

	return state.withMutations((state) => {
		(state as any).updateIn(
			['files', file.parent, 'data'],
			(data: Store.Directory['data']) => data?.delete(file.name)
		);

		updateFile(state, { id, newName, newParent, isTrashed });

		const updatedFile = state.files.get(id)!;
		const { name, parent } = updatedFile;

		// Replace file in case of name collision
		const fileToReplace = (state.files.get(
			parent
		) as Store.Directory).data.get(name);
		if (fileToReplace) deleteFile(state, { id: fileToReplace });

		fs.setDirectoryData(state, parent, updatedFile);
	});
};

const moveToTrash: Actions.Handler<{
	id: Store.File['id'];
}> = (state, { id }) => {
	const { name } = state.files.get(id)!;
	const trashName = fs.trashFileName(name, id);

	return state.withMutations((state) => {
		moveFile(state, {
			id,
			newName: trashName,
			isTrashed: true,
		});
		createFile(state, {
			name: trashName,
			type: 'symlink',
			parent: DIRECTORY_ID.trash,
			data: id,
		});
	});
};

const restoreFile: Actions.Handler<{
	id: Store.File['id'];
}> = (state, { id }) => {
	const target = state.files.get(id)!;
	const sanitizedName = fs.sanitizeFileName(target.name);

	return state.withMutations((state) => {
		const ancestorDirectories = fs
			.sanitizeFileName(target.path)
			.split(SEP)
			.slice(2, -1); // ['', 'main', ..., target.name]

		// restore whole file path if some directories were deleted
		const parentId = ancestorDirectories.reduce((parentId, targetName) => {
			const parent = state.files.get(parentId) as Store.Directory;
			let targetId = parent.data.get(targetName);

			if (!targetId) {
				mutations.once({
					type: 'FILE_CREATED',
					act: ({ file }) => {
						targetId = file.id;
					},
				});
				createFile(state, {
					name: targetName,
					parent: parentId,
					type: 'directory',
				});
			}

			return targetId!;
		}, DIRECTORY_ID.main);

		moveFile(state, {
			id,
			newName: sanitizedName,
			newParent: parentId,
			isTrashed: false,
		});
	});
};

const setActiveFile: Actions.Handler<{
	id: Store.ActiveFileId;
}> = (state, { id }) => {
	if (!id) {
		return state.set('activeFile', fs.createActiveFile());
	}

	return state.withMutations((state) => {
		const file = state.files.get(id) as Store.RegularFile;

		state.set(
			'activeFile',
			fs.createActiveFile({
				ref: file,
			})
		);

		mutations.dispatch({
			type: 'FILE_SELECTED',
			payload: { state, file },
		});
	});
};

const setFileDataState: Actions.Handler<{
	id: Store.File['id'];
	dataState: Store.FileData['state'];
}> = (state, { id, dataState }) => {
	return (state as any).updateIn(['data', id], (data: Store.FileData) => ({
		...data,
		state: dataState,
	}));
};

export const handlers = {
	'fs/createFile': createFile,
	'fs/createUntitledFile': createUntitledFile,
	'fs/deleteFile': deleteFile,
	'fs/moveToTrash': moveToTrash,
	'fs/restoreFile': restoreFile,
	'fs/renameFile': renameFile,
	'fs/moveFile': moveFile,
	'fs/setActiveFile': setActiveFile,
	'fs/setFileDataState': setFileDataState,
};
