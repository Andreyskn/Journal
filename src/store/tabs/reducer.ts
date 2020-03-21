import Immutable from 'immutable';

export const TabRecord = Immutable.Record<TypedTab>({
	_type: 'tab',
	id: 0,
	contentId: 0,
	contentType: 'taskLists',
});

export const TabsStateRecord = Immutable.Record<TypedTabsState>({
	_type: 'tabs-state',
	activeTabId: 0,
	tabsList: Immutable.OrderedMap([['0', TabRecord()]]),
});

// @ts-ignore FIXME:
export const tabsReducer: Reducer<ImmutableTabsState, TabAction> = (
	state,
	action
) => {
	switch (action.type) {
		case '@tabs/ADD_TAB': {
			const id = Date.now();
			return state.updateIn(['tabsList'], tabsList =>
				tabsList.set(
					id.toString(),
					TabRecord({ contentType: 'taskLists', id, contentId: 1 })
				)
			);
		}

		default: {
			// if (process.env.NODE_ENV === 'development') {
			// 	const unhandled: never = action;
			// }
			return state;
		}
	}
};
