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
			parent: Directory['id'] | null;
		};
		type TaggedDirectory = TaggedRecord<Directory, 'file'>;
		type ImmutableDirectory = ImmutableRecord<TaggedDirectory>;

		type RegularFile = BaseFile & {
			type: string;
			data: FileData['id'];
			parent: Directory['id'];
		};
		type TaggedRegularFile = TaggedRecord<RegularFile, 'file'>;
		type ImmutableRegularFile = ImmutableRecord<TaggedRegularFile>;

		type File = RegularFile | Directory;
		type TaggedFile = TaggedRecord<File, 'file'>;
		type ImmutableFile = ImmutableRecord<TaggedFile>;

		type FileType = string;
		type FileExtension = string;
		type FileData = { id: string; state: unknown };

		type ActiveFile = {
			ref: Maybe<ImmutableRegularFile>;
		};
		type TaggedActiveFile = TaggedRecord<ActiveFile, 'active-file'>;
		type ImmutableActiveFile = ImmutableRecord<TaggedActiveFile>;

		type ActiveFileId = Maybe<RegularFile['id']>;
		type ActiveFilePath = Maybe<RegularFile['path']>;

		type FileSystemState = {
			data: Immutable.Map<FileData['id'], FileData>;
			files: Immutable.Map<File['id'], ImmutableFile>;
			activeFile: ImmutableActiveFile;
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
