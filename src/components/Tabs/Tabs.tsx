import React from 'react';
import './tabs.scss';
import { useBEM, generateId } from '../../utils';
import { Button, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { useStore } from '../../store';

export type TabsProps = {
	tabs: TabsState;
};

const [tabsBlock, tabsElement] = useBEM('tabs');

export const Tabs: React.FC<TabsProps> = ({
	tabs: { activeTabId, tabsList },
}) => {
	const { dispatch } = useStore();

	const addTab = (contentType: 'tasks') => () => {
		dispatch.thunk.addTab();
	};

	const setActiveTab = (id: Tab['id']) => () => {
		if (activeTabId !== id) {
			dispatch.tabsAction('@tabs/SET_ACTIVE_TAB', id);
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
					text={tab.get('contentPath').join('_')}
					intent={tab.get('id') === activeTabId ? 'success' : 'none'}
					onClick={setActiveTab(tab.get('id'))}
				/>
			))}
			<Popover content={createTabMenu} position='bottom-left' minimal>
				<Button icon='add' />
			</Popover>
		</div>
	);
};
