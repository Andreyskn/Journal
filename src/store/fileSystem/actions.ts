import { FileSystemHandlers } from './reducer';

declare global {
	type CreateFile = Action<FileSystemHandlers, '@fs/CREATE_FILE'>;
	type DeleteFile = Action<FileSystemHandlers, '@fs/DELETE_FILE'>;
	type RenameFile = Action<FileSystemHandlers, '@fs/RENAME_FILE'>;
	type SetActiveFile = Action<FileSystemHandlers, '@fs/SET_ACTIVE_FILE'>;
	type CreateFolder = Action<FileSystemHandlers, '@fs/CREATE_FOLDER'>;

	type FileSystemAction =
		| CreateFile
		| DeleteFile
		| RenameFile
		| SetActiveFile
		| CreateFolder;
}
