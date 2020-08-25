import { actionHandler } from '../../utils';
import * as helpers from './helpers';
import { getFilePath } from '../fileSystem';
import { mutations } from '../mutations';

mutations.on({
	type: 'FILE_CREATED',
	act: ({ state, file }) => {
		if (file.type !== 'directory') {
			createTab(state, { file });
		}
	},
});

export const createTab: App.Handler<{ file: App.ImmutableFile }> = (
	state,
	{ file }
) => {
	if (file.type === 'directory') return state;

	const { id, name, type, parent } = file as App.RegularFile;

	return state.update('tabs', (tabs) =>
		tabs.set(
			file.id,
			helpers.createTab({
				id,
				name,
				type,
				path: getFilePath(state.files, name, parent),
			})
		)
	);
};

export const tabsHandlers = [actionHandler('@tabs/CREATE_TAB', createTab)];
