import React from 'react';
import './browser.scss';
import { useBEM } from '../../utils';
import { TaskList } from '../TaskList';
import { Tabs } from '../Tabs';
import { useSelector } from 'react-redux';

export type BrowserProps = {};

const [browserBlock, browserElement] = useBEM('browser');

export const Browser: React.FC<BrowserProps> = props => {
	const state = useSelector<ImmutableAppState, ImmutableAppState>(
		state => state
	);

	const tabsState = state.tabs;
	const activeTab = tabsState.tabsList.get(tabsState.activeTabId)!;
	const content = state.getIn(activeTab.contentPath);

	return (
		<div className={browserBlock()}>
			<Tabs state={state} />
			<TaskList taskList={content} key={content.id} />
		</div>
	);
};
