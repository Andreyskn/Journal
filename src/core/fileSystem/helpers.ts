import Immutable from 'immutable';
import { generateId } from '../../utils';
import { TYPE_BY_EXTENSION } from '../../plugins';
import { DIRECTORY_ID, SEP } from './constants';

export const createFileRecord = Immutable.Record<App.TaggedFile>({
	_tag: 'file',
	id: generateId(),
	lastModifiedAt: 0,
	name: '',
	path: '',
	parent: null,
	type: 'directory',
	isTrashed: false,
	data: Immutable.OrderedMap(),
});

export const createDirectory = ({
	name,
	path,
	parent = null,
	data = Immutable.OrderedMap(),
	id = generateId(),
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
		id: generateId(),
		lastModifiedAt: Date.now(),
	});
};

export const createSymlink = ({
	name,
	path,
	parent,
	data,
}: Pick<App.RegularFile, 'name' | 'path' | 'data' | 'parent'>) => {
	return createFileRecord({
		type: 'symlink',
		name,
		path,
		parent,
		data,
		id: generateId(),
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

export const createActiveFile = Immutable.Record<App.TaggedActiveFile>({
	_tag: 'active-file',
	ref: null,
});

export const getFileType = (name: string): App.File['type'] => {
	const extension = /(\..+)$/.exec(name)?.[1] as Maybe<App.FileExtension>;
	return extension ? TYPE_BY_EXTENSION[extension] : 'directory';
};

export const isDirectory = (
	file: App.ImmutableFile
): file is App.ImmutableDirectory => {
	return file.type === 'directory';
};

export const isSymlink = (
	file: App.ImmutableFile
): file is App.ImmutableSymlink => {
	return file.type === 'symlink';
};

export const isRegularFile = (
	file: App.ImmutableFile
): file is App.ImmutableRegularFile => {
	return !isDirectory(file) && !isSymlink(file);
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

export const trashFileName = (name: App.File['name'], id: App.File['id']) => {
	return `${name}__TRASHED__${id}__`;
};

const TRASHED_RE = /__TRASHED__[^__]+__/g;

export const sanitizeFileName = (name: string) => {
	return name.replace(TRASHED_RE, '');
};

export const isTrashed = (file: App.ImmutableFile) => {
	return file.isTrashed || TRASHED_RE.test(file.path);
};

export const getMainRelativePath = (path: App.File['path']) => {
	return path.replace(`${SEP}${DIRECTORY_ID.main}`, '');
};
