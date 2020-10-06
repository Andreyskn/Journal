import Immutable from 'immutable';
import { createActiveFile, createDirectory, createFileRecord } from './helpers';
import { DIRECTORY_ID, ROOT_NAME, PATHS } from './constants';

const main = createDirectory({
	id: DIRECTORY_ID.main,
	name: DIRECTORY_ID.main,
	parent: DIRECTORY_ID.root,
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

export const state: App.FileSystemState = {
	data: Immutable.Map(),
	files: Immutable.Map([
		[root.id, root],
		[main.id, main],
		[trash.id, trash],
		[favorites.id, favorites],
	]),
	activeFile: createActiveFile(),
};

export const reviver: App.StateReviver = (tag, key, value) => {
	switch (tag) {
		case 'file':
			return createFileRecord(value);
		case 'active-file':
			return createActiveFile(value);
	}

	switch (key) {
		case 'files':
		case 'data':
			return value.toMap();
		case 'activeFile':
			return value.toJS();
	}
};
