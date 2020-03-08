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
	tabs: TabsState['tabs'];
	activeTabId: TabsState['activeTabId'];
};

export const Browser: React.FC<BrowserProps> = props => {
	const { activeTabId, tabs, taskList } = useSelector<AppState, SelectedData>(
		state => ({
			taskList: state.taskLists.get(0)!,
			tabs: state.tabs,
			activeTabId: state.activeTabId,
		})
	);

	return (
		<div className={browserBlock()}>
			<Tabs tabs={tabs} activeTabId={activeTabId} />
			<TaskList taskList={taskList} />
		</div>
	);
};
