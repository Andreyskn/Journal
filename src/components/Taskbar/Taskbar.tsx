import React, { useMemo } from 'react';

import './taskbar.scss';

import { bem } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useEnhancedDispatch, useSelector } from '../../core';
import { windowRegistry } from '../Windows/registry';

export type TaskbarProps = {};

const classes = bem('taskbar', ['popover', 'menu-toggle', 'entry'] as const);

export const Taskbar: React.FC<TaskbarProps> = (props) => {
	const { windows } = useSelector((state) => ({
		windows: state.windows,
	}));

	const windowsArray = useMemo(() => Array.from(windows.values()), [windows]);
	const dispatch = useEnhancedDispatch();
	const menuEntries = useMemo(
		() =>
			Array.from(windowRegistry.values())
				.filter((win) => win.menuEntry)
				.sort((a, b) => b.menuEntry!.order - a.menuEntry!.order),
		[]
	);

	const onWindowShow = (id: App.Window['id']) => () => {
		dispatch.windows.bringToFront({ id });
	};

	return (
		<div className={classes.taskbarBlock()}>
			<Popover
				position='top-left'
				minimal
				popoverClassName={classes.popoverElement()}
			>
				<Button
					icon='applications'
					minimal
					className={classes.menuToggleElement()}
				/>
				<Menu>
					{menuEntries.map(({ id, icon, title }) => (
						<MenuItem
							key={id}
							icon={icon}
							text={title}
							onClick={onWindowShow(id)}
						/>
					))}
				</Menu>
			</Popover>
			{windowsArray.map(({ id, status }) => {
				if (status === 'closed') return null;

				const { title, icon } = windowRegistry.get(id)!;

				const onClick = () => {
					dispatch.windows.setStatus({
						id,
						status: status === 'minimized' ? 'open' : 'minimized',
					});
				};

				return (
					<Button
						key={id}
						icon={icon}
						text={title}
						className={classes.entryElement()}
						active={status !== 'minimized'}
						onClick={onClick}
						alignText='left'
					/>
				);
			})}
		</div>
	);
};
