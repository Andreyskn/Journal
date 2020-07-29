import Immutable from 'immutable';
import { defaultTaskListId } from '../tasks';
import { extensions, defaultFileName } from '../../utils';

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

const rootFolder: Model.TaggedFolder = {
	_tag: 'folder',
	name: '',
	path: '/',
	content: {
		folders: Immutable.List(),
		files: Immutable.List([defaultTasksFile.path.absolute]),
	},
};

export const FolderRecord = Immutable.Record<Model.TaggedFolder>(rootFolder);

export const FileRecord = Immutable.Record<Model.TaggedFile>({
	_tag: 'file',
	name: defaultFileName,
	type: 'tasks',
	path: {
		absolute: `/${defaultFileName}${extensions.tasks}`,
		base: `${defaultFileName}${extensions.tasks}`,
		dir: '/',
		content: ['taskLists', defaultTaskListId],
	},
});

export const defaultActiveFilePath = defaultTasksFile.path.absolute;

export const defaultFileSystemState: Model.FileSystemState = {
	folders: Immutable.OrderedMap([
		[
			rootFolder.path,
			FolderRecord({
				content: {
					...rootFolder.content,
					folders: Immutable.List(['/Folder/']),
				},
			}),
		],
		[
			'/Folder/',
			FolderRecord({
				name: 'Folder',
				path: '/Folder/',
				content: {
					files: Immutable.List(),
					folders: Immutable.List(['/Folder2/']),
				},
			}),
		],
		[
			'/Folder2/',
			FolderRecord({
				name: 'Folder2',
				path: '/Folder2/',
				content: { files: Immutable.List(), folders: Immutable.List() },
			}),
		],
	]),
	files: Immutable.OrderedMap([
		[defaultTasksFile.path.absolute, FileRecord(defaultTasksFile)],
	]),
	activeFilePath: defaultActiveFilePath,
	cwd: rootFolder.path,
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
		const fileName = defaultFileName + (i > 1 ? `_${i}` : '');
		const baseName = `${fileName}${extensions[type]}`.toLowerCase();

		if (!usedBaseNames.has(baseName)) {
			return fileName;
		}

		i++;
	}
};

const createFile: Handler<{
	name?: Model.File['name'];
	folderPath?: Model.Folder['path'];
	type: Model.File['type'];
	contentPath: Model.File['path']['content'];
}> = (state, action) => {
	const { name, type, contentPath, folderPath = state.cwd } = action.payload;

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

const setCurrentDir: Handler<Model.Folder['path']> = (state, action) => {
	return state.set('cwd', action.payload);
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
	'@fs/DELETE_FILE': deleteFile,
	'@fs/RENAME_FILE': renameFile,
	'@fs/SET_ACTIVE_FILE': setActiveFile,
	'@fs/SET_CWD': setCurrentDir,
	// '@fs/CREATE_FOLDER': createFile,
	// '@fs/DELETE_FOLDER': createFile,
	// '@fs/RENAME_FOLDER': createFile,
};

export type FileSystemHandlers = typeof fileSystemHandlers;
