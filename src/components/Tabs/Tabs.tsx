import React from 'react';
import './tabs.scss';
import { bem } from '../../utils';
import { Alignment, Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { PLUGINS, PLUGINS_MAP } from '../../plugins';

const classes = bem('tabs', [
	'tab-wrapper',
	'tab-button',
	'tab-close',
	'bar',
	'add',
] as const);

export type TabsProps = {
	dispatch: App.CoreDispatch;
	tabs: App.Tab[];
	activeTabId: App.ActiveFileId;
};

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, dispatch }) => {
	const createFile = (type: App.RegularFile['type']) => () => {
		dispatch.fs.createUntitledFile({ type });
	};

	const onSelect = (id: App.Tab['id']) => () => {
		if (id !== activeTabId) {
			dispatch.fs.setActiveFile({ id });
		}
	};

	const onClose = (id: App.Tab['id']) => (e: React.MouseEvent) => {
		if (e.button === 0 || e.button === 1) {
			dispatch.tabs.closeTab({ id });
		}
	};

	const renderTab = ({ id, name, type, path }: App.Tab) => {
		const isActive = id === activeTabId;

		return (
			<div
				className={classes.tabWrapperElement({ active: isActive })}
				key={id}
				title={path}
			>
				<Button
					text={name}
					icon={PLUGINS_MAP[type].icon}
					intent={isActive ? 'success' : 'none'}
					onClick={onSelect(id)}
					className={classes.tabButtonElement()}
					minimal
					fill
					alignText={Alignment.LEFT}
					onAuxClick={onClose(id)}
				/>
				<Button
					icon='small-cross'
					className={classes.tabCloseElement()}
					minimal
					onClick={onClose(id)}
				/>
			</div>
		);
	};

	return (
		<div className={classes.tabsBlock()}>
			<div className={classes.barElement()}>
				{tabs.map(renderTab)}
				<Popover position='bottom-left' minimal>
					<Button
						icon='plus'
						minimal
						className={classes.addElement()}
					/>
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
				</Popover>
			</div>
		</div>
	);
};
