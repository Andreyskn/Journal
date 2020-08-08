import Immutable from 'immutable';
import { fileExtensions } from '../../utils';

type FoldersKey = KeyOf<Store.FileSystemState, 'folders'>;
type FilesKey = KeyOf<Store.FileSystemState, 'files'>;
type FolderContentKey = KeyOf<Store.Folder, 'content'>;
type FolderContentFoldersKey = KeyOf<Store.Folder['content'], 'folders'>;
type FolderContentFilesKey = KeyOf<Store.Folder['content'], 'files'>;

type FolderContent = {
	folders: Immutable.List<Store.Folder['path']>;
	files: Immutable.List<Store.File['path']['absolute']>;
};

declare global {
	namespace Store {
		type Folder = {
			name: string;
			path: Path;
			content: FolderContent;
		};
		type TaggedFolder = TaggedRecord<Folder, 'folder'>;
		type ImmutableFolder = ImmutableRecord<TaggedFolder>;

		type File = {
			name: string;
			type: 'tasks' | 'notes';
			path: {
				absolute: Path;
				base: Path;
				dir: Path;
				content: PathTo['taskList'];
			};
		};
		type TaggedFile = TaggedRecord<File, 'file'>;
		type ImmutableFile = ImmutableRecord<TaggedFile>;

		type FileExtension = typeof fileExtensions[number];

		type FileSystemState = {
			folders: Immutable.Map<Folder['path'], ImmutableFolder>;
			files: Immutable.Map<File['path']['absolute'], ImmutableFile>;
			activeFilePath: File['path']['absolute'] | null;
		};

		interface ImmutableAppState {
			updateIn(
				path: PathTo['foldersInFolder'],
				updater: Updater<FolderContent['folders']>
			): ImmutableAppState;
			updateIn(
				path: PathTo['filesInFolder'],
				updater: Updater<FolderContent['files']>
			): ImmutableAppState;
			getIn(path: PathTo['file']): ImmutableFile;
		}

		interface PathTo {
			folder: [FoldersKey, Folder['path']];
			foldersInFolder: [
				FoldersKey,
				Folder['path'],
				FolderContentKey,
				FolderContentFoldersKey
			];
			filesInFolder: [
				FoldersKey,
				Folder['path'],
				FolderContentKey,
				FolderContentFilesKey
			];
			file: [FilesKey, File['path']['absolute']];
		}
	}
}
