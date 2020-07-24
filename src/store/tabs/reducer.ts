import Immutable from 'immutable';
import { generateId } from '../../utils';
import { defaultTaskListId } from '../tasks';

export const defaultTabId = generateId();

export const TabRecord = Immutable.Record<TypedTab>({
	_type: 'tab',
	id: defaultTabId,
	contentType: 'tasks',
	contentPath: ['tasks', 'taskLists', defaultTaskListId],
});

export const TabsStateRecord = Immutable.Record<TypedTabsState>({
	_type: 'tabs-state',
	activeTabId: defaultTabId,
	tabsList: Immutable.OrderedMap([[defaultTabId, TabRecord()]]),
});

export const tabsReducer: Reducer<ImmutableTabsState, TabAction> = (
	tabsState,
	action
) => {
	switch (action.type) {
		case '@tabs/ADD_TAB': {
			const contentPath = action.payload;
			const id = generateId();

			return tabsState.withMutations(tabsState => {
				tabsState
					.updateIn(['tabsList'], tabsList =>
						tabsList.set(id, TabRecord({ id, contentPath }))
					)
					.set('activeTabId', id);
			});
		}

		case '@tabs/SET_ACTIVE_TAB': {
			return tabsState.set('activeTabId', action.payload);
		}

		default:
			return tabsState;
	}
};
