import Immutable from 'immutable';
import { defaultTaskListId } from '../tasks';
import {
	extensions,
	DEFAULT_FILE_NAME,
	ROOT_FOLDER_PATH,
	PATH_DELIMITER,
} from '../../utils';

const defaultTasksFile: Model.File = {
	name: 'Tasks',
	type: 'tasks',
	path: {
		absolute: `${ROOT_FOLDER_PATH}Tasks${extensions.tasks}`,
		base: `Tasks${extensions.tasks}`,
		dir: ROOT_FOLDER_PATH,
		content: ['taskLists', defaultTaskListId],
	},
};

const rootFolder: Model.Folder = {
	name: '',
	path: ROOT_FOLDER_PATH,
	content: {
		folders: Immutable.List(),
		files: Immutable.List([defaultTasksFile.path.absolute]),
	},
};

export const FolderRecord = Immutable.Record<Model.TaggedFolder>({
	_tag: 'folder',
	name: '',
	path: '',
	content: {
		folders: Immutable.List(),
		files: Immutable.List(),
	},
});

export const FileRecord = Immutable.Record<Model.TaggedFile>({
	_tag: 'file',
	name: DEFAULT_FILE_NAME,
	type: 'tasks',
	path: {
		absolute: `${ROOT_FOLDER_PATH}${DEFAULT_FILE_NAME}${extensions.tasks}`,
		base: `${DEFAULT_FILE_NAME}${extensions.tasks}`,
		dir: ROOT_FOLDER_PATH,
		content: ['taskLists', defaultTaskListId],
	},
});

export const defaultActiveFilePath = defaultTasksFile.path.absolute;

export const defaultFileSystemState: Model.FileSystemState = {
	folders: Immutable.Map([[rootFolder.path, FolderRecord(rootFolder)]]),
	files: Immutable.Map([
		[defaultActiveFilePath, FileRecord(defaultTasksFile)],
	]),
	activeFilePath: defaultActiveFilePath,
};

const generateName = (
	state: Model.ImmutableAppState,
	folderPath: string,
	type: Model.File['type']
) => {
	const siblingFilePaths = state.folders.get(folderPath)!.content.files;
	const usedBaseNames = siblingFilePaths
		.map(path => state.files.get(path)!.path.base.toLowerCase())
		.toSet();

	let i = 1;
	while (true) {
		const fileName = DEFAULT_FILE_NAME + (i > 1 ? `_${i}` : '');
		const baseName = `${fileName}${extensions[type]}`.toLowerCase();

		if (!usedBaseNames.has(baseName)) {
			return fileName;
		}

		i++;
	}
};

const createFile: Handler<{
	name?: Model.FileSystemState['activeFilePath'];
	folderPath?: Model.Folder['path'];
	type: Model.File['type'];
	contentPath: Model.File['path']['content'];
}> = (state, action) => {
	const {
		name,
		type,
		contentPath,
		folderPath = ROOT_FOLDER_PATH,
	} = action.payload;

	const fileName = name || generateName(state, folderPath, type);
	const baseName = `${fileName}${extensions[type]}`;
	const absolutePath = `${folderPath}${baseName}`;

	const newFile: Model.File = {
		name: fileName,
		type,
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
		(state as any).updateIn(
			['folders', folderPath, 'content', 'files'],
			(files: Model.Folder['content']['files']) =>
				files.push(absolutePath).sort()
		);
		state.set('activeFilePath', newFile.path.absolute);
	});
};

const deleteFile: Handler = (state, action) => {
	return state;
};

const renameFile: Handler = (state, action) => {
	return state;
};

const setActiveFile: Handler<Model.File['path']['absolute']> = (
	state,
	action
) => {
	return state.set('activeFilePath', action.payload);
};

const createFolder: Handler<{
	name: string;
	parentPath: Model.Folder['path'];
}> = (state, action) => {
	const { name, parentPath } = action.payload;

	const path = `${parentPath}${name}${PATH_DELIMITER}`;

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
		(state as any).updateIn(
			['folders', parentPath, 'content', 'folders'],
			(folders: Model.Folder['content']['folders']) =>
				folders.push(path).sort()
		);
		state.set('activeFilePath', path);
	});
};

// const deleteFolder: Handler = (state, action) => {
// 	return state;
// };

// const renameFolder: Handler = (state, action) => {
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
