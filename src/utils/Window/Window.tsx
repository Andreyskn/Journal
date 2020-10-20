import React from 'react';
import { Classes, Button, ButtonGroup, Icon } from '@blueprintjs/core';
import './window.scss';

import { Position, useMove } from '../useMove';
import { ResizeProps, Resize } from '../Resize/Resize';
import { bem } from '../bem';

const classes = bem('window', [
	'header',
	'title',
	'icon',
	'controls',
	'body',
] as const);

const defaultPosition: Position = { top: 150, left: 150 };

export type WindowProps = Pick<
	ResizeProps,
	'initialWidth' | 'initialHeight'
> & {
	title: string;
	icon?: IconType;
	initialPosition?: Position;
	onReposition: (position: Position) => void;
};

export const Window: React.FC<WindowProps> = (props) => {
	const {
		children,
		title,
		icon,
		initialPosition = defaultPosition,
		initialWidth,
		initialHeight,
		onReposition,
	} = props;

	const { containerRef, handlerRef, onMoveEnd, setPosition } = useMove(
		initialPosition
	);

	onMoveEnd(onReposition);

	const onPositionChange: ResizeProps['onPositionChange'] = (position) => {
		setPosition(position);
	};

	return (
		<Resize
			className={classes.windowBlock(null, Classes.DARK)}
			mode='freeform'
			ref={containerRef}
			onPositionChange={onPositionChange}
			initialWidth={initialWidth}
			initialHeight={initialHeight}
			minWidth={140}
			minHeight={120}
			maxWidth={1}
			maxHeight={1}
		>
			<div className={classes.headerElement()}>
				<div className={classes.titleElement()} ref={handlerRef}>
					<Icon className={classes.iconElement()} icon={icon} />
					{title}
				</div>
				<ButtonGroup className={classes.controlsElement()} minimal>
					<Button icon='minus' />
					<Button icon='maximize' />
					<Button icon='cross' intent='danger' />
				</ButtonGroup>
			</div>
			<div className={classes.bodyElement()}>{children}</div>
		</Resize>
	);
};
