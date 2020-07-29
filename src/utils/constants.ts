import { IconName } from '@blueprintjs/core';

export const fileIcons: Record<Model.File['type'], IconName> = {
	tasks: 'form',
	notes: 'manual',
};

export const extensions: Record<Model.File['type'], string> = {
	tasks: '.t',
	notes: '.n',
};

export const defaultFileName = 'Untitled';
