import React from 'react';
import './browser.scss';
import { useBEM } from '../../utils';
import { TaskList } from '../TaskList';
import { Tabs } from '../Tabs';
import { useSelector } from 'react-redux';

export type BrowserProps = {};

const [browserBlock, browserElement] = useBEM('browser');

type SelectedData = {
	taskList: ImmutableTaskList;
	tabs: TabsState;
};

export const Browser: React.FC<BrowserProps> = props => {
	const state = useSelector<ImmutableAppState, ImmutableAppState>(
		state => state
	);

	// TODO: types for get method
	const tabsState = state.get('tabs');
	const activeTab = tabsState.tabsList.get(tabsState.activeTabId)!;
	const content = state.getIn(activeTab.get('contentPath'));

	return (
		<div className={browserBlock()}>
			<Tabs tabs={tabsState} />
			<TaskList taskList={content} key={content.id} />
		</div>
	);
};
