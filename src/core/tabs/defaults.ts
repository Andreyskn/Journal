import Immutable from 'immutable';
import { createTab } from './helpers';
import { fsDefaults } from '../fileSystem';

const tasksTab = createTab(fsDefaults.activeFile);

const tabsState: App.TabsState = {
	tabs: Immutable.OrderedMap([[tasksTab.id, tasksTab]]),
};

export const tabsDefaults = {
	tabsState,
};
