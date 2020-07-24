import React from 'react';
import './tabs.scss';
import { useBEM } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useDispatch } from '../../store';

export type TabsProps = {
	state: ImmutableAppState;
};

const [tabsBlock, tabsElement] = useBEM('tabs');

export const useTabs = () => {};

export const Tabs: React.FC<TabsProps> = ({ state }) => {
	const { activeTabId, tabsList } = state.tabs;
	const dispatch = useDispatch();

	const addTab = (contentType: Tab['contentType']) => () => {
		dispatch.tasksAction.addTaskList();
	};

	const setActiveTab = (id: Tab['id']) => () => {
		if (activeTabId !== id) {
			dispatch.tabsAction.setActiveTab(id);
		}
	};

	const createTabMenu = (
		<Menu>
			<MenuItem
				icon='tick'
				text='New Task List'
				onClick={addTab('tasks')}
			/>
		</Menu>
	);

	return (
		<div className={tabsBlock()}>
			{tabsList.toArray().map(([key, tab]) => (
				<Button
					key={key}
					text={state.getIn(tab.contentPath).title}
					intent={tab.id === activeTabId ? 'success' : 'none'}
					onClick={setActiveTab(tab.id)}
				/>
			))}
			<Popover content={createTabMenu} position='bottom-left' minimal>
				<Button icon='add' />
			</Popover>
		</div>
	);
};
