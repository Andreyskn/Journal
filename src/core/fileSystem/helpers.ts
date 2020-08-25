import Immutable from 'immutable';
import { identifier } from '../../utils';
import { SEP } from './constants';

const FileRecord = Immutable.Record<App.TaggedFile>({
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
	return FileRecord({
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
	return FileRecord({
		type,
		name,
		path,
		parent,
		data,
		id: identifier.generateId('file'),
		lastModifiedAt: Date.now(),
	});
};

export const getFileType = (name: string): App.File['type'] => {
	const extension = /(\..+)$/.exec(name)?.[1];

	if (!extension) return 'directory';

	switch (extension as Maybe<App.FileExtension>) {
		case '.t':
			return 'tasks';
		case '.n':
			return 'notes';
		default:
			throw Error(`Unknown extension: ${extension}`);
	}
};

// export const getActiveFile = (state: App.ImmutableAppState) => {
// 	const { id } = state.activeFile;
// 	return (id && (state.files.get(id) as App.RegularFile)) || null;
// };

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
