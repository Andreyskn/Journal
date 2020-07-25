import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Tabs, TabsProps } from './Tabs';
import { generateId, checkUnhandled } from '../../utils';

export const TabsConnector: React.FC = () => {
	const dispatch = useDispatch();

	const { activeTabId, tabsList } = useSelector<ImmutableAppState, TabsState>(
		state => ({
			tabsList: state.tabsList,
			activeTabId: state.activeTabId,
		})
	);

	const onAction: TabsProps['onAction'] = useCallback(action => {
		switch (action.type) {
			case 'ADD_TAB': {
				const contentId = generateId();
				dispatch<AddTaskList>({
					type: '@tasks/ADD_TASK_LIST',
					payload: contentId,
				});
				dispatch<AddTab>({
					type: '@tabs/ADD_TAB',
					payload: ['taskLists', contentId],
				});
				break;
			}
			case 'SET_ACTIVE': {
				dispatch<SetActiveTab>({
					type: '@tabs/SET_ACTIVE_TAB',
					payload: action.payload,
				});
				break;
			}
			default:
				checkUnhandled(action);
		}
	}, []);

	return (
		<Tabs
			tabsList={tabsList}
			activeTabId={activeTabId}
			onAction={onAction}
		/>
	);
};
