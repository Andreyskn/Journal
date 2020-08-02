import Immutable from 'immutable';

declare global {
	namespace Model {
		type Folder = {
			name: string;
			path: string;
			content: {
				folders: Immutable.List<Folder['path']>;
				files: Immutable.List<File['path']['absolute']>;
			};
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
			folders: Immutable.Map<Folder['path'], ImmutableFolder>;
			files: Immutable.Map<File['path']['absolute'], ImmutableFile>;
			activeFilePath: File['path']['absolute'] | Folder['path'] | null;
		};
	}
}
