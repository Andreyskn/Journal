import Immutable from 'immutable';
import { createTab } from './helpers';
import { fsDefaults } from '../fileSystem';

const tasksTab = createTab({
	id: fsDefaults.tasks.id,
	name: fsDefaults.tasks.name,
	type: 'tasks',
	path: fsDefaults.tasks.path,
});

const tabsState: App.TabsState = {
	tabs: Immutable.OrderedMap([[tasksTab.id, tasksTab]]),
};

export const tabsDefaults = {
	tabsState,
};
