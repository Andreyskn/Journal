import Immutable from 'immutable';
import { createFile, createDirectory } from './helpers';
import { DIRECTORY_ID, SEP, ROOT_NAME, PATHS } from './constants';
import { plugins } from '../pluginManager';
import { identifier } from '../../utils';

const sampleData = plugins.map((plugin) =>
	plugin.init({ id: identifier.generateId(plugin.type) })
);

const sampleFiles = plugins.map((plugin, i) => {
	const name = `${plugin.label}${plugin.extension}`;

	return createFile({
		type: plugin.type,
		data: sampleData[i].id,
		name,
		parent: 'main',
		path: [PATHS.main, name].join(SEP),
	});
});

const main = createDirectory({
	id: DIRECTORY_ID.main,
	name: DIRECTORY_ID.main,
	parent: DIRECTORY_ID.root,
	data: Immutable.OrderedMap(sampleFiles.map((sf) => [sf.name, sf.id])),
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
	id: sampleFiles[0].id,
	path: sampleFiles[0].path,
	isPreview: false,
};

const fileSystemState: App.FileSystemState = {
	data: Immutable.Map(sampleData.map((sd) => [sd.id, sd])),
	files: Immutable.Map([
		[root.id, root],
		[main.id, main],
		[trash.id, trash],
		[favorites.id, favorites],
		...(sampleFiles.map((sf) => [sf.id, sf]) as any[]),
	]),
	activeFile,
};

export const fsDefaults = {
	activeFile: sampleFiles[0] as App.RegularFile,
	fileSystemState,
};
