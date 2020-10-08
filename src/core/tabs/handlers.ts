import * as helpers from './helpers';
import { mutations } from '../mutations';

mutations
	.on({
		type: 'FILE_CREATED',
		act: ({ state, file }) => {
			createTab(state, { file });
		},
	})
	.on({
		type: 'FILE_UPDATED',
		act: ({ state, file }) => {
			updateTab(state, { file });
		},
	})
	.on({
		type: 'FILE_DELETED',
		act: ({ state, file }) => {
			closeTab(state, { id: file.id });
		},
	})
	.on({
		type: 'FILE_SELECTED',
		act: ({ state, file }) => {
			createTab(state, { file });
		},
	});

const createTab: App.Handler<{ file: App.ImmutableFile }> = (
	state,
	{ file }
) => {
	if (file.type === 'directory' || state.tabs.get(file.id)) return state;

	const { id, name, type, path } = file as App.RegularFile;

	// TODO: open new tab right next to currently active
	return state.update('tabs', (tabs) =>
		tabs.set(
			id,
			helpers.createTab({
				id,
				name,
				type,
				path,
			})
		)
	);
};

const updateTab: App.Handler<{ file: App.ImmutableFile }> = (
	state,
	{ file: { id, name, path } }
) => {
	if (!state.tabs.get(id)) return state;

	return (state as any).updateIn(['tabs', id], (tab: App.ImmutableTab) =>
		tab.withMutations((tab) => {
			tab.set('name', name).set('path', path);
		})
	);
};

const closeTab: App.Handler<{ id: App.File['id'] }> = (state, { id }) => {
	if (!state.tabs.get(id)) return state;

	const tabKeys = state.tabs.keySeq();
	const targetIndex = tabKeys.indexOf(id);
	const nextTabId =
		tabKeys.get(targetIndex + 1) || targetIndex > 0
			? tabKeys.get(targetIndex - 1)!
			: null;
	const { id: activeFileId } = (nextTabId && state.tabs.get(nextTabId)!) || {
		id: null,
	};

	return state.withMutations((state) => {
		state.update('tabs', (tabs) => tabs.delete(id));

		mutations.dispatch({
			type: 'SET_ACTIVE_FILE',
			payload: { state, id: activeFileId },
		});
	});
};

export const handlers = {
	'@tabs/createTab': createTab,
	'@tabs/closeTab': closeTab,
};
