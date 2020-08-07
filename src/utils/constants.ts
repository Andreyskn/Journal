import { IconName } from '@blueprintjs/core';

export const fileIcons: Record<Store.File['type'], IconName> = {
	tasks: 'form',
	notes: 'manual',
};

export const fileExtensions = ['.t', '.n'] as const;

export const extensionByType: Record<
	Store.File['type'],
	Store.FileExtension
> = {
	tasks: '.t',
	notes: '.n',
};

export const typeByExtension: Record<
	Store.FileExtension,
	Store.File['type']
> = {
	'.t': 'tasks',
	'.n': 'notes',
};

export const DEFAULT_FILE_NAME = 'Untitled';

export const PATH_DELIMITER = '/';

export const ROOT_FOLDER_PATH = PATH_DELIMITER;
