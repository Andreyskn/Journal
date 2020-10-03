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
	});

const createTab: App.Handler<{ file: App.ImmutableFile }> = (
	state,
	{ file }
) => {
	if (file.type === 'directory') return state;

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
	const nextActiveTab = nextTabId && state.tabs.get(nextTabId)!;

	return state.withMutations((state) => {
		state.update('tabs', (tabs) => tabs.delete(id));

		// TODO: handle in file system
		state.update('activeFile', (activeFile) => ({
			...activeFile,
			id: nextActiveTab && nextActiveTab.id,
			path: nextActiveTab && nextActiveTab.path,
		}));
	});
};

const closeTabByPath: App.Handler<{ path: App.File['path'] }> = (
	state,
	{ path }
) => {
	const filteredTabs = state.tabs.filter((tab) => !tab.path.startsWith(path));

	if (filteredTabs.size === state.tabs.size) return state;

	// TODO: set next active tab

	return state.withMutations((state) => {
		state.set('tabs', filteredTabs);

		state.update('activeFile', (activeFile) => ({
			...activeFile,
			id: null,
			path: null,
		}));
	});
};

export const handlers = {
	'@tabs/CREATE_TAB': createTab,
	'@tabs/CLOSE_TAB': closeTabById,
};
