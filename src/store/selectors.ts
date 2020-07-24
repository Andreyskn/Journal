export const getActiveTaskListId = (state: ImmutableAppState) => {
	const tabsState = state.tabs;
	const activeTab = tabsState.tabsList.get(tabsState.activeTabId)!;
	return state.getIn(activeTab.contentPath).id;
};
