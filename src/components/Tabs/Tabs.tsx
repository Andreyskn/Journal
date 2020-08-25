import React from 'react';
import './tabs.scss';
import { useBEM, fileIcons } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { TabsDispatch } from './dispatcher';

const [tabsBlock, tabsElement] = useBEM('tabs');

export type TabsProps = {
	dispatch: TabsDispatch;
	tabs: App.Tab[];
	activeTabId: App.FileSystemState['activeFile']['id'];
};

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, dispatch }) => {
	const createFile = (type: App.RegularFile['type']) => () => {
		dispatch.createFile(type);
	};

	const setActiveTab = (id: App.Tab['id']) => () => {
		dispatch.setActiveTab(id);
	};

	const createTabMenu = (
		<Menu>
			<MenuItem
				icon={fileIcons.tasks}
				text='New Task List'
				onClick={createFile('tasks')}
			/>
			<MenuItem
				icon={fileIcons.notes}
				text='New Notes'
				onClick={createFile('notes')}
			/>
		</Menu>
	);

	const renderTab = ({ id, name, type, path }: App.Tab) => {
		const isActive = id === activeTabId;

		return (
			<Button
				key={id}
				text={name}
				icon={fileIcons[type]}
				intent={isActive ? 'success' : 'none'}
				onClick={isActive ? undefined : setActiveTab(id)}
			/>
		);
	};

	return (
		<div className={tabsBlock()}>
			{tabs.map(renderTab)}
			<Popover content={createTabMenu} position='bottom-left' minimal>
				<Button icon='add' />
			</Popover>
		</div>
	);
};
