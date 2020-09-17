import Immutable from 'immutable';
import { identifier } from '../../utils';
import { TYPE_BY_EXTENSION } from '../../plugins/constants';
import { SEP } from './constants';

export const createFileRecord = Immutable.Record<App.TaggedFile>({
	_tag: 'file',
	id: identifier.generateId('file'),
	lastModifiedAt: 0,
	name: '',
	path: '',
	parent: null,
	type: 'directory',
	data: Immutable.OrderedMap(),
});

export const createDirectory = ({
	name,
	path,
	parent = null,
	data = Immutable.OrderedMap(),
	id = identifier.generateId('file'),
}: Pick<App.Directory, 'name' | 'path'> &
	Partial<Pick<App.Directory, 'parent' | 'data' | 'id'>>) => {
	return createFileRecord({
		id,
		name,
		path,
		data,
		parent,
		lastModifiedAt: Date.now(),
	});
};

export const createFile = ({
	type,
	name,
	path,
	parent,
	data,
}: Pick<App.RegularFile, 'type' | 'name' | 'path' | 'data' | 'parent'>) => {
	return createFileRecord({
		type,
		name,
		path,
		parent,
		data,
		id: identifier.generateId('file'),
		lastModifiedAt: Date.now(),
	});
};

export const setDirectoryData = (
	state: App.ImmutableAppState,
	directoryId: App.File['parent'],
	fileToAdd: App.ImmutableFile
) => {
	if (!directoryId) return;

	(state as any).updateIn(
		['files', directoryId, 'data'],
		(data: App.Directory['data']) =>
			data.set(fileToAdd.name, fileToAdd.id).sortBy(
				(id, name) => ({
					name,
					isDirectory: Number(
						(state.files.get(id) || fileToAdd).type === 'directory'
					),
				}),
				(a, b) =>
					b.isDirectory - a.isDirectory ||
					a.name.localeCompare(b.name)
			)
	);
};

export const getFileType = (name: string): App.File['type'] => {
	const extension = /(\..+)$/.exec(name)?.[1] as Maybe<App.FileExtension>;
	return extension ? TYPE_BY_EXTENSION[extension] : 'directory';
};

export const getFilePath = (
	files: App.FileSystemState['files'],
	fileName: App.File['name'],
	parentId: App.File['parent']
) => {
	const path = [fileName];
	let parent = parentId && files.get(parentId);

	while (parent) {
		path.push(parent.name);
		parent = parent.parent && files.get(parent.parent);
	}

	return path.reverse().join(SEP);
};

export const getFilePathById = (
	files: App.FileSystemState['files'],
	fileId: App.File['id']
) => {
	const { name, parent } = files.get(fileId)!;
	return getFilePath(files, name, parent);
};
