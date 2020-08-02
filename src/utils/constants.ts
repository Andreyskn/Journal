import { IconName } from '@blueprintjs/core';

export const fileIcons: Record<Model.File['type'], IconName> = {
	tasks: 'form',
	notes: 'manual',
};

export const extensions: Record<Model.File['type'], string> = {
	tasks: '.t',
	notes: '.n',
};

export const DEFAULT_FILE_NAME = 'Untitled';

export const PATH_DELIMITER = '/';

export const ROOT_FOLDER_PATH = PATH_DELIMITER;
