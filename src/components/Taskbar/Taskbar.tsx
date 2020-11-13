import { useMemo } from 'react';

import './taskbar.scss';

import { bem, Null } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useDispatch, useSelector } from '../../core';
import { windowRegistry } from '../Windows/registry';
import { useUpload } from './useUpload';

const classes = bem('taskbar', ['popover', 'menu-toggle', 'entry'] as const);

export const Taskbar: React.FC = () => {
	const { windows, windowOrder, files } = useSelector((state) => ({
		windows: state.windows,
		windowOrder: state.windowOrder,
		files: state.files,
	}));
	const { dispatch } = useDispatch();
	const { fileInput, onUpload } = useUpload(files, dispatch);

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
			{fileInput}
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
					{menuEntries.map(({ id, icon, title, menuEntry }) => {
						const Label = menuEntry!.Label || Null;

						return (
							<MenuItem
								key={id}
								icon={icon}
								text={title}
								onClick={onWindowOpen(id)}
								labelElement={<Label />}
							/>
						);
					})}
					<MenuItem
						icon='upload'
						text='Upload File'
						onClick={onUpload}
					/>
				</Menu>
			</Popover>
			{windowsArray.map(({ id, status }) => {
				if (status === 'closed') return null;
				const isActive = id === topWindow;

				const { title, icon } = windowRegistry.get(id)!;

				const onClick = () => {
					isActive
						? dispatch.windows.minimize({ id })
						: dispatch.windows.open({ id });
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
