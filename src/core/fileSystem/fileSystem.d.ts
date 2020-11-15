import Immutable from 'immutable';
import { handlers } from './handlers';

type BaseFile = {
	id: string;
	name: string;
	lastModifiedAt: Timestamp;
	parent: string;
	path: Path;
	isTrashed: boolean;
};

declare global {
	namespace Model {
		type Directory = BaseFile & {
			type: 'directory';
			data: Immutable.OrderedMap<File['name'], File['id']>;
		};

		type Symlink = BaseFile & {
			type: 'symlink';
			data: File['id'];
		};

		type RegularFile = BaseFile & {
			type: FileType;
			data: FileData['id'];
		};

		type FileType = Plugin.Type;

		type FileExtension = Plugin.Extension;

		type FileData = { id: string; state: unknown };

		type File = RegularFile | Directory | Symlink;

		type ActiveFile<T = RegularFile> = {
			ref: Maybe<T>;
		};
	}

	namespace Store {
		type Directory = ImmutableRecord<Model.Directory>;

		type Symlink = ImmutableRecord<Model.Symlink>;

		type RegularFile = ImmutableRecord<Model.RegularFile>;

		type File = ImmutableRecord<Model.File>;

		type FileData = Model.FileData;

		type ActiveFile = ImmutableRecord<Model.ActiveFile<RegularFile>>;

		type ActiveFileId = Maybe<RegularFile['id']>;

		type ActiveFilePath = Maybe<RegularFile['path']>;

		type FileSystemState = {
			data: Immutable.Map<FileData['id'], FileData>;
			files: Immutable.Map<File['id'], File>;
			activeFile: ActiveFile;
		};

		interface Registry {
			FileSystem: SetCorePart<
				FileSystemState,
				typeof handlers,
				keyof FileSystemState,
				{
					File: TaggedObject<Model.File, 'file'>;
					ActiveFile: TaggedObject<
						Model.ActiveFile<RegularFile>,
						'active-file'
					>;
				}
			>;
		}
	}
}
