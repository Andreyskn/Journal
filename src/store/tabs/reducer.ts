import Immutable from 'immutable';
import { generateId } from '../../utils';
import { defaultTaskListId } from '../tasks';

export const defaultTabId = generateId();

export const TabRecord = Immutable.Record<TypedTab>({
	_type: 'tab',
	id: defaultTabId,
	contentType: 'tasks',
	contentPath: ['taskLists', defaultTaskListId],
});

export const defaultTabsState: TabsState = {
	activeTabId: defaultTabId,
	tabsList: Immutable.OrderedMap([[defaultTabId, TabRecord()]]),
};

const addTab: Handler<Tab['contentPath']> = (state, action) => {
	const contentPath = action.payload;
	const id = generateId();

	return state.withMutations(tabsState => {
		tabsState
			.updateIn(['tabsList'], tabsList =>
				tabsList.set(id, TabRecord({ id, contentPath }))
			)
			.set('activeTabId', id);
	});
};

const setActiveTab: Handler<Tab['id']> = (state, action) => {
	return state.set('activeTabId', action.payload);
};

export const tabsHandlers = {
	'@tabs/ADD_TAB': addTab,
	'@tabs/SET_ACTIVE_TAB': setActiveTab,
};

export type TabsHandlers = typeof tabsHandlers;
