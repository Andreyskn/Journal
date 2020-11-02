import React, { useEffect } from 'react';
import { Classes, Button, ButtonGroup, Icon } from '@blueprintjs/core';
import './window.scss';

import { bem, useMove, ResizeProps, Resize } from '../../../utils';

const classes = bem('window', [
	'header',
	'title',
	'icon',
	'controls',
	'body',
] as const);

export type WindowProps = {
	title: string;
	icon?: IconType;
	position: Position;
	onReposition: (position: Position) => void;
	width: NonNullable<ResizeProps['width']>;
	height: NonNullable<ResizeProps['height']>;
	isMaximized?: boolean;
	onResize: NonNullable<ResizeProps['onResizeEnd']>;
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
};

export const Window: React.FC<WindowProps> = ({
	children,
	title,
	icon,
	position,
	width,
	height,
	isMaximized,
	onReposition,
	onMinimize,
	onMaximize,
	onClose,
	onResize,
}) => {
	const { containerRef, handlerRef, setPosition } = useMove(
		position,
		onReposition
	);

	useEffect(() => {
		setPosition(position);
	}, [position]);

	return (
		<Resize
			className={classes.windowBlock(null, Classes.DARK)}
			mode='freeform'
			ref={containerRef}
			onSetAnchor={setPosition}
			width={width}
			height={height}
			minWidth={140}
			minHeight={120}
			maxHeight={window.innerHeight - 30}
			onResizeEnd={onResize}
		>
			<div className={classes.headerElement()}>
				<div className={classes.titleElement()} ref={handlerRef}>
					<Icon className={classes.iconElement()} icon={icon} />
					{title}
				</div>
				<ButtonGroup className={classes.controlsElement()} minimal>
					<Button icon='minus' onClick={onMinimize} />
					<Button
						icon={isMaximized ? 'square' : 'duplicate'}
						onClick={onMaximize}
					/>
					<Button icon='cross' intent='danger' onClick={onClose} />
				</ButtonGroup>
			</div>
			<div className={classes.bodyElement()}>{children}</div>
		</Resize>
	);
};
