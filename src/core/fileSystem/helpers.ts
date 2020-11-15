import Immutable from 'immutable';
import { generateId } from '../../utils';
import { DIRECTORY_ID, PATHS, SEP } from './constants';

export const createFileRecord = Immutable.Record<Store.TaggedRecords['File']>({
	__tag: 'file',
	id: generateId(),
	lastModifiedAt: 0,
	name: '',
	path: '',
	parent: DIRECTORY_ID.main,
	type: 'directory',
	isTrashed: false,
	data: Immutable.OrderedMap(),
});

export const createDirectory = ({
	name,
	path,
	parent,
	data = Immutable.OrderedMap(),
	id = generateId(),
}: Pick<Store.Directory, 'name' | 'path' | 'parent'> &
	Partial<Pick<Store.Directory, 'data' | 'id'>>) => {
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
}: Pick<Store.RegularFile, 'type' | 'name' | 'path' | 'data' | 'parent'>) => {
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
}: Pick<Store.RegularFile, 'name' | 'path' | 'data' | 'parent'>) => {
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
	state: Store.State,
	directoryId: Store.File['parent'],
	fileToAdd: Store.File
) => {
	(state as any).updateIn(
		['files', directoryId, 'data'],
		(data: Store.Directory['data']) =>
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

export const createActiveFile = Immutable.Record<
	Store.TaggedRecords['ActiveFile']
>({
	__tag: 'active-file',
	ref: null,
});

export const createFileData = (state: any = null): Store.FileData => ({
	id: generateId(),
	state,
});

export const isDirectory = (file: Store.File): file is Store.Directory => {
	return file.type === 'directory';
};

export const isSymlink = (file: Store.File): file is Store.Symlink => {
	return file.type === 'symlink';
};

export const isRegularFile = (file: Store.File): file is Store.RegularFile => {
	return !isDirectory(file) && !isSymlink(file);
};

export const getFilePath = (
	files: Store.FileSystemState['files'],
	fileName: Store.File['name'],
	parentId: Store.File['parent']
) => {
	const path = [fileName];
	let parent = files.get(parentId)!;

	while (parent.id !== DIRECTORY_ID.root) {
		path.push(parent.name);
		parent = files.get(parent.parent)!;
	}

	return SEP + path.reverse().join(SEP);
};

export const trashFileName = (
	name: Store.File['name'],
	id: Store.File['id']
) => {
	return `${name}__TRASHED__${id}__`;
};

const TRASHED_RE = /__TRASHED__[^__]+__/g;

export const sanitizeFileName = (name: string) => {
	return name.replace(TRASHED_RE, '');
};

export const isTrashed = (file: Store.File) => {
	return file.isTrashed || TRASHED_RE.test(file.path);
};

export const getMainRelativePath = (path: Store.File['path']) => {
	return path.replace(PATHS.main, '') || SEP;
};
