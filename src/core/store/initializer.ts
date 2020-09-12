import Immutable from 'immutable';

import { fsDefaults } from '../fileSystem';
import { tabsDefaults } from '../tabs';

export const createAppState = Immutable.Record<App.AppState>({
	...tabsDefaults.tabsState,
	...fsDefaults.fileSystemState,
});
