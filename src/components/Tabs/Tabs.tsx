import React from 'react';
import './tabs.scss';
import { useBEM, fileIcons } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { TabsDispatch } from './dispatcher';

const [tabsBlock, tabsElement] = useBEM('tabs');

export type TabsProps = Pick<Model.FileSystemState, 'files'> & {
	dispatch: TabsDispatch;
	tabs: Model.Tab[];
	activeFile: Model.ImmutableFile;
};

export const Tabs: React.FC<TabsProps> = ({
	tabs,
	files,
	activeFile,
	dispatch,
}) => {
	const addTab = (fileType: Model.File['type']) => () => {
		dispatch.addTab();
	};

	const setActiveTab = (filePath: Model.Tab['filePath']) => () => {
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
		const isActive = filePath === activeFile.path.absolute;

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
