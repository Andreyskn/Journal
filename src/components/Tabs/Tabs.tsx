import React from 'react';
import './tabs.scss';
import { useBEM } from '../../utils';
import { Alignment, Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { TabsDispatch } from './dispatcher';
import { PLUGINS, PLUGINS_MAP } from '../../plugins/registry';

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
			{PLUGINS.map((plugin) => (
				<MenuItem
					key={plugin.type}
					icon={plugin.icon}
					text={`New ${plugin.label}`}
					onClick={createFile(plugin.type)}
				/>
			))}
		</Menu>
	);

	const renderTab = ({ id, name, type, path }: App.Tab) => {
		const isActive = id === activeTabId;

		return (
			<div
				className={tabsElement('tab-wrapper', { active: isActive })}
				key={id}
				title={path}
			>
				<Button
					text={name}
					icon={PLUGINS_MAP[type].icon}
					intent={isActive ? 'success' : 'none'}
					onClick={isActive ? undefined : setActiveTab(id)}
					className={tabsElement('tab-button')}
					minimal
					fill
					alignText={Alignment.LEFT}
				/>
				<Button
					icon='small-cross'
					className={tabsElement('tab-close')}
					minimal
					onClick={() => dispatch.closeTab(id)}
				/>
			</div>
		);
	};

	return (
		<div className={tabsBlock()}>
			<div className={tabsElement('bar')}>
				{tabs.map(renderTab)}
				<Popover content={createTabMenu} position='bottom-left' minimal>
					<Button
						icon='plus'
						minimal
						className={tabsElement('add')}
					/>
				</Popover>
			</div>
		</div>
	);
};
