import Immutable from 'immutable';

declare global {
	namespace Model {
		type Folder = {
			name: string;
			path: string;
		};
		type TaggedFolder = TaggedRecord<Folder, 'folder'>;
		type ImmutableFolder = ImmutableRecord<TaggedFolder>;

		type File = {
			name: string;
			type: 'tasks' | 'notes';
			path: {
				absolute: string;
				base: string;
				dir: string;
				content: TasksPath['toTaskList'];
			};
		};
		type TaggedFile = TaggedRecord<File, 'file'>;
		type ImmutableFile = ImmutableRecord<TaggedFile>;

		type FileSystemState = {
			folders: Immutable.OrderedMap<Folder['path'], ImmutableFolder>;
			files: Immutable.OrderedMap<
				File['path']['absolute'],
				ImmutableFile
			>;
			activeFilePath: File['path']['absolute'] | null;
		};
	}
}
