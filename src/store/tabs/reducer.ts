import Immutable from 'immutable';
import { generateId } from '../../utils';
import { defaultActiveFilePath } from '../fileSystem';

export const defaultTabId = generateId();

export const TabRecord = Immutable.Record<Store.TaggedTab>({
	_tag: 'tab',
	filePath: defaultActiveFilePath,
});

export const defaultTabsState: Store.TabsState = {
	tabs: Immutable.List([TabRecord()]),
};

const addTab: Store.Handler<Store.Tab['filePath']> = (state, action) => {
	return state.update('tabs', tabs =>
		tabs.push(TabRecord({ filePath: action.payload }))
	);
};

export const tabsHandlers = {
	'@tabs/ADD_TAB': addTab,
};

export type TabsHandlers = typeof tabsHandlers;
