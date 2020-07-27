import Immutable from 'immutable';
import { defaultTaskListId } from '../tasks';
import { extensions } from '../../utils';

export const FolderRecord = Immutable.Record<Model.TaggedFolder>({
	_tag: 'folder',
	name: '',
	path: '/',
});

export const FileRecord = Immutable.Record<Model.TaggedFile>({
	_tag: 'file',
	name: 'Name',
	type: 'tasks',
	path: {
		absolute: `/Name${extensions.tasks}`,
		base: `Name${extensions.tasks}`,
		dir: '/',
		content: ['taskLists', defaultTaskListId],
	},
});

const defaultTasksFile: Model.File = {
	name: 'Tasks',
	type: 'tasks',
	path: {
		absolute: `/Tasks${extensions.tasks}`,
		base: `Tasks${extensions.tasks}`,
		dir: '/',
		content: ['taskLists', defaultTaskListId],
	},
};

export const defaultActiveFilePath = defaultTasksFile.path.absolute;

export const defaultFileSystem: Model.FileSystemState = {
	folders: Immutable.OrderedMap(),
	files: Immutable.OrderedMap([
		[defaultTasksFile.path.absolute, FileRecord(defaultTasksFile)],
	]),
	activeFilePath: defaultActiveFilePath,
};

const createFile: Handler<{
	name: Model.File['name'];
	type: Model.File['type'];
	contentPath: Model.File['path']['content'];
}> = (state, action) => {
	// TODO: handle Untitled files
	const { name, type, contentPath } = action.payload;

	const cwd = state.activeFilePath
		? state.files.get(state.activeFilePath)!.path.dir
		: '/';

	const baseName = `${name}${extensions[type]}`;

	const newFile: Model.File = {
		name,
		type,
		path: {
			absolute: `${cwd}${baseName}`,
			base: baseName,
			content: contentPath,
			dir: cwd,
		},
	};

	return state.withMutations(state => {
		// TODO: sort files by name
		state.update('files', files =>
			files.set(newFile.path.absolute, FileRecord(newFile))
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

const setActiveFile: Handler = (state, action) => {
	return state;
};

// const createFolder: Handler = (state, action) => {
// 	return state;
// };

// const deleteFolder: Handler = (state, action) => {
// 	return state;
// };

// const renameFolder: Handler = (state, action) => {
// 	return state;
// };

export const fileSystemHandlers = {
	'@fs/CREATE_FILE': createFile,
	'@fs/DELETE_FILE': createFile,
	'@fs/RENAME_FILE': createFile,
	'@fs/SET_ACTIVE_FILE': createFile,
	// '@fs/CREATE_FOLDER': createFile,
	// '@fs/DELETE_FOLDER': createFile,
	// '@fs/RENAME_FOLDER': createFile,
};

export type FileSystemHandlers = typeof fileSystemHandlers;
