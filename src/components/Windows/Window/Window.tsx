import React, {
	forwardRef,
	PropsWithChildren,
	RefObject,
	useEffect,
} from 'react';
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

export type WindowProps = PropsWithChildren<{
	title: string;
	icon?: IconType;
	position: Position;
	isMaximized?: boolean;
	style?: React.CSSProperties;
	width: NonNullable<ResizeProps['width']>;
	height: NonNullable<ResizeProps['height']>;
	onContainerClick?: (e: React.MouseEvent) => void;
	onContainerMouseDown?: (e: React.MouseEvent) => void;
	onReposition: (position: Position) => void;
	onResize: NonNullable<ResizeProps['onResizeEnd']>;
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
}>;

const withoutPropagation = (fn: AnyFunction) => (e: React.MouseEvent) => {
	e.stopPropagation();
	fn();
};

export const Window = forwardRef<HTMLDivElement, WindowProps>(
	(
		{
			children,
			title,
			icon,
			position,
			width,
			height,
			style,
			isMaximized,
			onContainerClick,
			onContainerMouseDown,
			onReposition,
			onMinimize,
			onMaximize,
			onClose,
			onResize,
		},
		ref
	) => {
		const { containerRef, handlerRef, setPosition } = useMove(
			position,
			onReposition,
			ref as RefObject<HTMLDivElement> | undefined
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
				style={style}
				disabled={isMaximized}
				onContainerClick={onContainerClick}
				onContainerMouseDown={onContainerMouseDown}
			>
				<div className={classes.headerElement()}>
					<div
						className={classes.titleElement()}
						ref={handlerRef}
						onDoubleClick={onMaximize}
					>
						<Icon className={classes.iconElement()} icon={icon} />
						{title}
					</div>
					<ButtonGroup className={classes.controlsElement()} minimal>
						<Button
							icon='minus'
							onClick={withoutPropagation(onMinimize)}
						/>
						<Button
							icon={isMaximized ? 'duplicate' : 'square'}
							onClick={withoutPropagation(onMaximize)}
						/>
						<Button
							icon='cross'
							intent='danger'
							onClick={withoutPropagation(onClose)}
						/>
					</ButtonGroup>
				</div>
				<div className={classes.bodyElement()}>{children}</div>
			</Resize>
		);
	}
);
