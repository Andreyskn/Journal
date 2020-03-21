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
	tabsList: TabsState['tabsList'];
	activeTabId: TabsState['activeTabId'];
};

export const Browser: React.FC<BrowserProps> = props => {
	const { activeTabId, tabsList, taskList } = useSelector<
		AppState,
		SelectedData
	>(state => ({
		taskList: state.tasks.taskLists.get('0')!,
		tabsList: state.tabs.tabsList,
		activeTabId: state.tabs.activeTabId,
	}));

	return (
		<div className={browserBlock()}>
			<Tabs tabsList={tabsList} activeTabId={activeTabId} />
			<TaskList taskList={taskList} />
		</div>
	);
};
