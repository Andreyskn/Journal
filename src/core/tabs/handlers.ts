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
			if (file.type === 'directory') {
				closeTabByPath(state, { path: file.path });
			} else closeTabById(state, { id: file.id });
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
	const tab = state.tabs.get(id);
	if (!tab) return state;

	return state.update('tabs', (tabs) =>
		tabs.update(id, (tab) =>
			tab.withMutations((tab) => {
				tab.set('name', name).set('path', path);
			})
		)
	);
};

const closeTabById: App.Handler<{ id: App.File['id'] }> = (state, { id }) => {
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

const closeTabByPath: App.Handler<{ path: App.File['path'] }> = (
	state,
	{ path }
) => {
	const filteredTabs = state.tabs.filter((tab) => !tab.path.startsWith(path));

	if (filteredTabs.size === state.tabs.size) return state;

	return state.withMutations((state) => {
		state.set('tabs', filteredTabs);

		// TODO: set proper next active tab
		mutations.dispatch({
			type: 'SET_ACTIVE_FILE',
			payload: { state, id: null },
		});
	});
};

export const handlers = {
	'@tabs/CREATE_TAB': createTab,
	'@tabs/CLOSE_TAB': closeTabById,
};
