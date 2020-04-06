import React from 'react';
import './tabs.scss';
import { useBEM, generateId } from '../../utils';
import { Button, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { useDispatch } from '../../store';

export type TabsProps = {
	tabs: TabsState;
};

const [tabsBlock, tabsElement] = useBEM('tabs');

export const Tabs: React.FC<TabsProps> = ({
	tabs: { activeTabId, tabsList },
}) => {
	const dispatch = useDispatch();

	const addTab = (contentType: 'tasks') => () => {
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
					text={tab.contentPath.join('_')}
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
