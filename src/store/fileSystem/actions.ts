import { FileSystemHandlers } from './reducer';

declare global {
	namespace Actions {
		type CreateFile = Store.Action<FileSystemHandlers, '@fs/CREATE_FILE'>;
		type DeleteFile = Store.Action<FileSystemHandlers, '@fs/DELETE_FILE'>;
		type RenameFile = Store.Action<FileSystemHandlers, '@fs/RENAME_FILE'>;
		type SetActiveFile = Store.Action<
			FileSystemHandlers,
			'@fs/SET_ACTIVE_FILE'
		>;
		type CreateFolder = Store.Action<
			FileSystemHandlers,
			'@fs/CREATE_FOLDER'
		>;
		type DeleteFolder = Store.Action<
			FileSystemHandlers,
			'@fs/DELETE_FOLDER'
		>;
		type RenameFolder = Store.Action<
			FileSystemHandlers,
			'@fs/RENAME_FOLDER'
		>;

		type FileSystemAction =
			| CreateFile
			| DeleteFile
			| RenameFile
			| SetActiveFile
			| CreateFolder
			| DeleteFolder
			| RenameFolder;
	}
}
