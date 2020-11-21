import {
	forwardRef,
	PropsWithChildren,
	useEffect,
	useRef,
	useImperativeHandle,
	useCallback,
} from 'react';
import { Classes, Button, ButtonGroup, Icon } from '@blueprintjs/core';
import './window.scss';

import {
	bem,
	useMove,
	ResizeProps,
	Resize,
	OnMoveEndCallback,
} from '../../../utils';

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
	onReposition?: OnMoveEndCallback;
	onResize?: ResizeProps['onResizeEnd'];
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
}>;

export type WindowRef = {
	container: HTMLDivElement | null;
	rect: Partial<Model.WindowRect> | null;
};

const withoutPropagation = (fn: AnyFunction) => (e: React.MouseEvent) => {
	e.stopPropagation();
	fn();
};

export const Window = forwardRef<WindowRef, WindowProps>((props, ref) => {
	const {
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
		onMinimize,
		onMaximize,
		onClose,
	} = props;

	const container = useRef<WindowRef['container']>(null);
	const rect = useRef<WindowRef['rect']>(null);

	const onReposition: OnMoveEndCallback = useCallback(
		(position) => {
			(rect.current ||= {}).position = position;
			props.onReposition?.(position);
		},
		[props.onReposition]
	);

	const onResize: NonNullable<ResizeProps['onResizeEnd']> = useCallback(
		(width, height) => {
			rect.current ||= {};
			rect.current.width = width;
			rect.current.height = height;
			props.onResize?.(width, height);
		},
		[props.onResize]
	);

	const { handlerRef, setPosition } = useMove(
		position,
		onReposition,
		container
	);

	useImperativeHandle(ref, () => ({
		get container() {
			return container.current;
		},
		get rect() {
			return rect.current;
		},
	}));

	useEffect(() => {
		setPosition(position);
	}, [position]);

	return (
		<Resize
			className={classes.windowBlock(null, Classes.DARK)}
			mode='freeform'
			ref={container}
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
});
