import React, { useMemo } from 'react';

import './taskbar.scss';

import { bem } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useDispatch, useSelector } from '../../core';
import { windowRegistry } from '../Windows/registry';

const classes = bem('taskbar', ['popover', 'menu-toggle', 'entry'] as const);

export const Taskbar: React.FC = () => {
	const { windows, windowOrder } = useSelector((state) => ({
		windows: state.windows,
		windowOrder: state.windowOrder,
	}));

	const { dispatch } = useDispatch();

	const { windowsArray, topWindow } = useMemo(() => {
		return {
			windowsArray: Array.from(windows.values()),
			topWindow: windowOrder.last(null),
		};
	}, [windows, windowOrder]);

	const menuEntries = useMemo(
		() =>
			Array.from(windowRegistry.values())
				.filter((win) => win.menuEntry)
				.sort((a, b) => b.menuEntry!.order - a.menuEntry!.order),
		[]
	);

	const onWindowOpen = (id: App.Window['id']) => () => {
		if (topWindow !== id) {
			dispatch.windows.open({ id });
		}
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
							onClick={onWindowOpen(id)}
						/>
					))}
				</Menu>
			</Popover>
			{windowsArray.map(({ id, status }) => {
				if (status === 'closed') return null;
				const isActive = id === topWindow;

				const { title, icon } = windowRegistry.get(id)!;

				const onClick = () => {
					isActive
						? dispatch.windows.minimize({ id })
						: dispatch.windows.bringToFront({ id });
				};

				return (
					<Button
						key={id}
						icon={icon}
						text={title}
						className={classes.entryElement()}
						active={isActive}
						onClick={onClick}
						alignText='left'
					/>
				);
			})}
		</div>
	);
};
