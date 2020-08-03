import React from 'react';
import './tabs.scss';
import { useBEM, fileIcons } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { TabsDispatch } from './dispatcher';

const [tabsBlock, tabsElement] = useBEM('tabs');

export type TabsProps = Pick<
	Store.FileSystemState,
	'activeFilePath' | 'files'
> & {
	dispatch: TabsDispatch;
	tabs: Store.Tab[];
};

export const Tabs: React.FC<TabsProps> = ({
	tabs,
	files,
	activeFilePath,
	dispatch,
}) => {
	const addTab = (fileType: Store.File['type']) => () => {
		dispatch.addTab();
	};

	const setActiveTab = (filePath: Store.Tab['filePath']) => () => {
		dispatch.setActiveTab(filePath);
	};

	const createTabMenu = (
		<Menu>
			<MenuItem
				icon={fileIcons.tasks}
				text='New Task List'
				onClick={addTab('tasks')}
			/>
			<MenuItem
				icon={fileIcons.notes}
				text='New Notes'
				onClick={addTab('notes')}
			/>
		</Menu>
	);

	const renderTab = ({ filePath }: Store.Tab) => {
		const file = files.get(filePath)!;
		const isActive = filePath === activeFilePath;

		return (
			<Button
				key={filePath}
				text={file.name}
				icon={fileIcons[file.type]}
				intent={isActive ? 'success' : 'none'}
				onClick={isActive ? undefined : setActiveTab(filePath)}
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
