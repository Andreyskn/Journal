import Immutable from 'immutable';
import { EXTENSIONS } from './constants';
import { fileSystemHandlers } from './handlers';

type BaseFileData = {
	id: string;
	name: string;
	lastModifiedAt: Timestamp;
	path: Path;
};

declare global {
	namespace Actions {
		type FileSystemAction = ExtractActions<
			typeof fileSystemHandlers[number]
		>;
	}

	namespace App {
		type Directory = BaseFileData & {
			type: 'directory';
			data: Immutable.OrderedMap<File['name'], File['id']>;
			parent: App.Directory['id'] | null;
		};

		type RegularFile = BaseFileData & {
			type: 'tasks' | 'notes';
			data: string; // content id
			parent: App.Directory['id'];
		};

		type File = RegularFile | Directory;

		type TaggedFile = App.TaggedRecord<File, 'file'>;
		type ImmutableFile = App.ImmutableRecord<TaggedFile>;

		type FileSystemState = {
			files: Immutable.Map<File['id'], ImmutableFile>;
			activeFile: {
				id: File['id'] | null;
				path: File['path'] | null;
				isPreview: boolean;
			};
		};

		type FileExtension = typeof EXTENSIONS[number];

		type FileSystemStateImmutableNonRecordKey =
			| 'files'
			| 'data'
			| 'activeFile';

		// interface ImmutableAppState {
		// 	updateIn(
		// 		path: PathTo['foldersInFolder'],
		// 		updater: Updater<FolderContent['folders']>
		// 	): ImmutableAppState;
		// 	updateIn(
		// 		path: PathTo['filesInFolder'],
		// 		updater: Updater<FolderContent['files']>
		// 	): ImmutableAppState;
		// 	getIn(path: PathTo['file']): ImmutableFile;
		// }
		// interface PathTo {
		// 	folder: [FoldersKey, Folder['path']];
		// 	foldersInFolder: [
		// 		FoldersKey,
		// 		Folder['path'],
		// 		FolderContentKey,
		// 		FolderContentFoldersKey
		// 	];
		// 	filesInFolder: [
		// 		FoldersKey,
		// 		Folder['path'],
		// 		FolderContentKey,
		// 		FolderContentFilesKey
		// 	];
		// 	file: [FilesKey, File['path']['absolute']];
		// }
	}
}
