import React, { Fragment, useMemo } from 'react';
import { useEnhancedDispatch, useSelector } from '../../core';
import { Window, WindowProps } from './Window/Window';
import { windowRegistry } from './registry';

const nullPosition: Position = { left: 0, top: 0 };

export const WindowManager: React.FC = () => {
	const { windows } = useSelector((state) => ({
		windows: state.windows,
	}));

	const windowsArray = useMemo(() => Array.from(windows.values()), [windows]);
	const dispatch = useEnhancedDispatch();

	return (
		<Fragment>
			{windowsArray.map(({ id, status, position, width, height }) => {
				const isVisible = status !== 'closed' && status !== 'minimized';
				if (!isVisible) return null;

				const { icon, title, Content } = windowRegistry.get(id)!;
				const isMaximized = status === 'maximized';

				const onReposition: WindowProps['onReposition'] = (
					position
				) => {
					dispatch.windows.setRect({ id, position });
				};

				const onResize: WindowProps['onResize'] = (width, height) => {
					dispatch.windows.setRect({ id, width, height });
				};

				const onMinimize = () => {
					dispatch.windows.setStatus({ id, status: 'minimized' });
				};

				const onMaximize = () => {
					dispatch.windows.setStatus({
						id,
						status: isMaximized ? 'open' : 'maximized',
					});
				};

				const onClose = () => {
					dispatch.windows.setStatus({ id, status: 'closed' });
				};

				return (
					<Window
						key={id}
						title={title}
						icon={icon}
						width={isMaximized ? window.innerWidth : width}
						height={isMaximized ? window.innerHeight : height}
						position={isMaximized ? nullPosition : position}
						isMaximized={isMaximized}
						onReposition={onReposition}
						onMinimize={onMinimize}
						onMaximize={onMaximize}
						onClose={onClose}
						onResize={onResize}
					>
						<Content />
					</Window>
				);
			})}
		</Fragment>
	);
};
