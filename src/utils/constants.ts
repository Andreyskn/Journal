import { IconName } from '@blueprintjs/core';

export const fileIcons: Record<Store.File['type'], IconName> = {
	tasks: 'form',
	notes: 'manual',
};

export const extensions: Record<Store.File['type'], Store.FileExtension> = {
	tasks: '.t',
	notes: '.n',
};

export const DEFAULT_FILE_NAME = 'Untitled';

export const PATH_DELIMITER = '/';

export const ROOT_FOLDER_PATH = PATH_DELIMITER;
