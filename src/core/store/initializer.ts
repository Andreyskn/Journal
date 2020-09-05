import Immutable from 'immutable';

import { tasksDefaults } from '../data/tasks';
import { fsDefaults } from '../fileSystem';
import { tabsDefaults } from '../tabs';

export const createAppState = Immutable.Record<App.AppState>({
	...tasksDefaults.tasksState,
	...tabsDefaults.tabsState,
	...fsDefaults.fileSystemState,
});
