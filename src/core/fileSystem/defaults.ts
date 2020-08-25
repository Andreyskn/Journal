import Immutable from 'immutable';
import { tasksDefaults } from '../data/tasks';
import { createFile, createDirectory } from './helpers';
import { DIRECTORY_ID, SEP, ROOT_NAME, PATHS } from './constants';

const tasks = createFile({
	type: 'tasks',
	data: tasksDefaults.taskList.id,
	name: 'Tasks.t',
	parent: 'main',
	path: [PATHS.main, 'Tasks.t'].join(SEP),
});

const main = createDirectory({
	id: DIRECTORY_ID.main,
	name: DIRECTORY_ID.main,
	parent: DIRECTORY_ID.root,
	data: Immutable.OrderedMap([[tasks.name, tasks.id]]),
	path: PATHS.main,
});

const trash = createDirectory({
	id: DIRECTORY_ID.trash,
	name: DIRECTORY_ID.trash,
	parent: DIRECTORY_ID.root,
	path: PATHS.trash,
});

const favorites = createDirectory({
	id: DIRECTORY_ID.favorites,
	name: DIRECTORY_ID.favorites,
	parent: DIRECTORY_ID.root,
	path: PATHS.favorites,
});

const root = createDirectory({
	id: DIRECTORY_ID.root,
	name: ROOT_NAME,
	data: Immutable.OrderedMap([
		[main.name, main.id],
		[trash.name, trash.id],
		[favorites.name, favorites.id],
	]),
	path: PATHS.root,
});

const activeFile: App.FileSystemState['activeFile'] = {
	id: tasks.id,
	path: tasks.path,
	isPreview: false,
};

const fileSystemState: App.FileSystemState = {
	files: Immutable.Map([
		[root.id, root],
		[main.id, main],
		[trash.id, trash],
		[favorites.id, favorites],
		[tasks.id, tasks],
	]),
	activeFile,
};

export const fsDefaults = {
	tasks,
	activeFile,
	fileSystemState,
};
