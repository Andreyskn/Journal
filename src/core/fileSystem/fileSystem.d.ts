import Immutable from 'immutable';
import { handlers } from './handlers';

type BaseFile = {
	id: string;
	name: string;
	lastModifiedAt: Timestamp;
	path: Path;
};

declare global {
	namespace Actions {
		type FileSystemAction = ExtractActions<typeof handlers>;
	}

	namespace App {
		type Directory = BaseFile & {
			type: 'directory';
			data: Immutable.OrderedMap<File['name'], File['id']>;
			parent: App.Directory['id'] | null;
		};

		type RegularFile = BaseFile & {
			type: string;
			data: FileData['id'];
			parent: App.Directory['id'];
		};

		type File = RegularFile | Directory;

		type TaggedFile = App.TaggedRecord<File, 'file'>;
		type ImmutableFile = App.ImmutableRecord<TaggedFile>;

		type FileType = string;
		type FileExtension = string;
		type FileData = { id: string; state: unknown };

		type FileSystemState = {
			data: Immutable.Map<FileData['id'], FileData>;
			files: Immutable.Map<File['id'], ImmutableFile>;
			activeFile: {
				id: File['id'] | null;
				path: File['path'] | null;
				isPreview: boolean;
			};
		};

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
