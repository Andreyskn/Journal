declare global {
	type AddTab = Action<'@tabs/ADD_TAB', Tab['contentPath']>;
	type SetActiveTab = Action<'@tabs/SET_ACTIVE_TAB', Tab['id']>;

	type TabAction = AddTab | SetActiveTab;

	interface Dispatch {
		tabsAction: typeof tabsActions;
	}
}

export const tabsActions = {
	setActiveTab: (tabId: Task['id']): ThunkAction => (dispatch, getState) => {
		dispatch<SetActiveTab>({
			type: '@tabs/SET_ACTIVE_TAB',
			payload: tabId,
		});
	},
};
