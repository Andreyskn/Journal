import Immutable from 'immutable';
import { defaultTaskListId } from '../tasks';
import {
	extensionByType,
	DEFAULT_FILE_NAME,
	ROOT_FOLDER_PATH,
	getFolderPath,
	typeByExtension,
} from '../../utils';

const defaultTasksFile: Store.File = {
	name: 'Tasks',
	type: 'tasks',
	path: {
		absolute: `${ROOT_FOLDER_PATH}Tasks${extensionByType.tasks}`,
		base: `Tasks${extensionByType.tasks}`,
		dir: ROOT_FOLDER_PATH,
		content: ['taskLists', defaultTaskListId],
	},
};

const rootFolder: Store.Folder = {
	name: '',
	path: ROOT_FOLDER_PATH,
	content: {
		folders: Immutable.List(),
		files: Immutable.List([defaultTasksFile.path.absolute]),
	},
};

export const FolderRecord = Immutable.Record<Store.TaggedFolder>({
	_tag: 'folder',
	name: '',
	path: '',
	content: {
		folders: Immutable.List(),
		files: Immutable.List(),
	},
});

export const FileRecord = Immutable.Record<Store.TaggedFile>({
	_tag: 'file',
	name: DEFAULT_FILE_NAME,
	type: 'tasks',
	path: {
		absolute: `${ROOT_FOLDER_PATH}${DEFAULT_FILE_NAME}${extensionByType.tasks}`,
		base: `${DEFAULT_FILE_NAME}${extensionByType.tasks}`,
		dir: ROOT_FOLDER_PATH,
		content: ['taskLists', defaultTaskListId],
	},
});

export const defaultActiveFilePath = defaultTasksFile.path.absolute;

export const defaultFileSystemState: Store.FileSystemState = {
	folders: Immutable.Map([[rootFolder.path, FolderRecord(rootFolder)]]),
	files: Immutable.Map([
		[defaultActiveFilePath, FileRecord(defaultTasksFile)],
	]),
	activeFilePath: defaultActiveFilePath,
};

const generateName = (
	state: Store.ImmutableAppState,
	folderPath: string,
	extension: Store.FileExtension
) => {
	const siblingFilePaths = state.folders.get(folderPath)!.content.files;
	const usedBaseNames = siblingFilePaths
		.map(path => state.files.get(path)!.path.base.toLowerCase())
		.toSet();

	let i = 1;
	while (true) {
		const fileName = DEFAULT_FILE_NAME + (i > 1 ? `_${i}` : '');
		const baseName = `${fileName}${extension}`.toLowerCase();

		if (!usedBaseNames.has(baseName)) {
			return fileName;
		}

		i++;
	}
};

const createFile: Store.Handler<{
	name?: Store.File['name'];
	folderPath?: Store.Folder['path'];
	extension: Store.FileExtension;
	contentPath: Store.File['path']['content'];
}> = (state, action) => {
	const {
		name,
		extension,
		contentPath,
		folderPath = ROOT_FOLDER_PATH,
	} = action.payload;

	const fileName = name || generateName(state, folderPath, extension);
	const baseName = `${fileName}${extension}`;
	const absolutePath = `${folderPath}${baseName}`;

	const newFile: Store.File = {
		name: fileName,
		type: typeByExtension[extension],
		path: {
			absolute: absolutePath,
			base: baseName,
			content: contentPath,
			dir: folderPath,
		},
	};

	return state.withMutations(state => {
		state.update('files', files =>
			files.set(newFile.path.absolute, FileRecord(newFile))
		);
		state.updateIn(
			['folders', folderPath, 'content', 'files'],
			(files: Store.Folder['content']['files']) =>
				files.push(absolutePath).sort()
		);
		state.set('activeFilePath', newFile.path.absolute);
	});
};

const deleteFile: Store.Handler = (state, action) => {
	return state;
};

const renameFile: Store.Handler = (state, action) => {
	return state;
};

const setActiveFile: Store.Handler<Store.File['path']['absolute']> = (
	state,
	action
) => {
	return state.set('activeFilePath', action.payload);
};

const createFolder: Store.Handler<{
	name: string;
	parentPath: Store.Folder['path'];
}> = (state, action) => {
	const { name, parentPath } = action.payload;

	const path = getFolderPath(parentPath, name);

	return state.withMutations(state => {
		state.update('folders', folders =>
			folders.set(
				path,
				FolderRecord({
					name,
					path,
				})
			)
		);
		state.updateIn(
			['folders', parentPath, 'content', 'folders'],
			(folders: Store.Folder['content']['folders']) =>
				folders.push(path).sort()
		);
	});
};

// const deleteFolder: Store.Handler = (state, action) => {
// 	return state;
// };

// const renameFolder: Store.Handler = (state, action) => {
// 	return state;
// };

export const fileSystemHandlers = {
	'@fs/CREATE_FILE': createFile,
	'@fs/DELETE_FILE': deleteFile,
	'@fs/RENAME_FILE': renameFile,
	'@fs/SET_ACTIVE_FILE': setActiveFile,
	'@fs/CREATE_FOLDER': createFolder,
	// '@fs/DELETE_FOLDER': createFile,
	// '@fs/RENAME_FOLDER': createFile,
};

export type FileSystemHandlers = typeof fileSystemHandlers;
