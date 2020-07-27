import React from 'react';
import './tabs.scss';
import { useBEM, fileIcons } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { TabsDispatch } from './tabsDispatch';

const [tabsBlock, tabsElement] = useBEM('tabs');

export type TabsProps = Pick<
	Model.FileSystemState,
	'activeFilePath' | 'files'
> & {
	dispatch: TabsDispatch;
	tabs: Model.Tab[];
};

export const Tabs: React.FC<TabsProps> = React.memo(
	({ tabs, files, activeFilePath, dispatch }) => {
		const addTab = (fileType: Model.File['type']) => () => {
			dispatch.addTab();
		};

		const setActiveTab = (filePath: Model.Tab['filePath']) => () => {
			if (activeFilePath === filePath) return;
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

		const renderTab = ({ filePath }: Model.Tab) => {
			const file = files.get(filePath)!;

			return (
				<Button
					key={filePath}
					text={file.name}
					icon={fileIcons[file.type]}
					intent={filePath === activeFilePath ? 'success' : 'none'}
					onClick={setActiveTab(filePath)}
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
	}
);
