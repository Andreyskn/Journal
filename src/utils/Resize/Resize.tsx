import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import './resize.scss';

import { bem } from '../bem';

const classes = bem('resize', ['handle'] as const);

const handleSides = [
	'left',
	'right',
	'top',
	'bottom',
	'top-left',
	'top-right',
	'bottom-left',
	'bottom-right',
] as const;

type HandleSide = typeof handleSides[number];

type Directed = {
	mode: 'directed';
	side: ExtractType<HandleSide, 'left' | 'right' | 'top' | 'bottom'>;
};

type Freeform = {
	mode: 'freeform';
};

type Mode = Directed | Freeform;

export type ResizeProps = Mode & {
	initialWidth?: number;
	initialHeight?: number;
	style?: React.CSSProperties;
};

type Size = { width: number; height: number };

const stubMousePos: Coordinates = { x: 0, y: 0 };
const stubSize: Size = { width: undefined as any, height: undefined as any };

const emptyWeakMap = new WeakMap<any>();

/**
 * TODO:
 * - useMove compatibility
 * - min and max size
 * - aspect ratio (?)
 */
export const Resize: React.FC<ResizeProps> = (props) => {
	const { initialWidth, initialHeight, children, style } = props;

	const container = useRef<HTMLDivElement | null>(null);
	const handles = useRef<WeakMap<HTMLDivElement, HandleSide>>(emptyWeakMap);
	const size = useRef(stubSize);
	const initialMousePos = useRef<Coordinates>(stubMousePos);
	const activeHandle = useRef<HTMLDivElement>();

	useLayoutEffect(() => {
		size.current.width = initialWidth ?? containerElement.width;
		size.current.height = initialHeight ?? containerElement.height;
	}, []);

	const containerElement = useMemo(
		() => ({
			get width() {
				return container.current!.offsetWidth;
			},
			set width(width: number) {
				container.current!.style.width = `${width}px`;
			},
			get height() {
				return container.current!.offsetHeight;
			},
			set height(height: number) {
				container.current!.style.height = `${height}px`;
			},
			get size(): Size {
				return { width: this.width, height: this.height };
			},
		}),
		[]
	);

	const onResize = useCallback((e: MouseEvent) => {
		const { width, height } = size.current;

		const resizeLeft = () => {
			containerElement.width =
				width + initialMousePos.current.x - e.clientX;
		};
		const resizeRight = () => {
			containerElement.width =
				width + e.clientX - initialMousePos.current.x;
		};
		const resizeTop = () => {
			containerElement.height =
				height + initialMousePos.current.y - e.clientY;
		};
		const resizeBottom = () => {
			containerElement.height =
				height + e.clientY - initialMousePos.current.y;
		};

		const actions: Record<HandleSide, void> = {
			get left() {
				return resizeLeft();
			},
			get right() {
				return resizeRight();
			},
			get top() {
				return resizeTop();
			},
			get bottom() {
				return resizeBottom();
			},
			get 'top-left'() {
				resizeTop();
				return resizeLeft();
			},
			get 'top-right'() {
				resizeTop();
				return resizeRight();
			},
			get 'bottom-left'() {
				resizeBottom();
				return resizeLeft();
			},
			get 'bottom-right'() {
				resizeBottom();
				return resizeRight();
			},
		};

		actions[handles.current.get(activeHandle.current!)!];
	}, []);

	const setAnchorPoint = (handle: HTMLDivElement) => {
		const cnt = container.current!;
		const rect = cnt.getBoundingClientRect();

		const anchorLeft = () => {
			cnt.style.right = 'auto';
			cnt.style.left = `${rect.left}px`;
		};

		const anchorRight = () => {
			cnt.style.left = 'auto';
			cnt.style.right = `${window.innerWidth - rect.right}px`;
		};

		const anchorTop = () => {
			cnt.style.bottom = 'auto';
			cnt.style.top = `${rect.top}px`;
		};

		const anchorBottom = () => {
			cnt.style.top = 'auto';
			cnt.style.bottom = `${window.innerHeight - rect.bottom}px`;
		};

		const actions: Record<HandleSide, void> = {
			get left() {
				return anchorRight();
			},
			get right() {
				return anchorLeft();
			},
			get top() {
				return anchorBottom();
			},
			get bottom() {
				return anchorTop();
			},
			get 'top-left'() {
				anchorRight();
				return anchorBottom();
			},
			get 'top-right'() {
				anchorLeft();
				return anchorBottom();
			},
			get 'bottom-left'() {
				anchorRight();
				return anchorTop();
			},
			get 'bottom-right'() {
				anchorLeft();
				return anchorTop();
			},
		};

		actions[handles.current.get(handle)!];
	};

	const onGrab = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		if (props.mode === 'freeform') {
			setAnchorPoint(e.target as HTMLDivElement);
		}
		activeHandle.current = e.target as HTMLDivElement;
		document.body.style.userSelect = 'none';
		initialMousePos.current = { x: e.clientX, y: e.clientY };
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onResize);
	}, []);

	const onRelease = useCallback(() => {
		size.current = containerElement.size;
		document.body.removeAttribute('style');
		document.removeEventListener('mouseup', onRelease);
		document.removeEventListener('mousemove', onResize);
	}, []);

	return (
		<div
			style={{
				...style,
				width: size.current.width,
				height: size.current.height,
				position: props.mode === 'freeform' ? 'fixed' : 'relative',
			}}
			className={classes.resizeBlock()}
			ref={container}
		>
			{children}
			{handleSides.map(
				(side) =>
					(props.mode === 'freeform' || props.side === side) && (
						<div
							key={side}
							className={classes.handleElement({
								[side]: true,
							})}
							ref={(el) => el && handles.current.set(el, side)}
							onMouseDown={onGrab}
						/>
					)
			)}
		</div>
	);
};
