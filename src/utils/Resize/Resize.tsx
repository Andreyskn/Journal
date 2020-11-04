import React, {
	forwardRef,
	PropsWithChildren,
	RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';

import './resize.scss';

import { bem } from '../bem';
import { toViewportUnits, userSelect } from '../helpers';

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
	onSetAnchor: (position: PartialPosition) => void;
};

type Mode = Directed | Freeform;

type Size = { width: Pixels; height: Pixels };

export type ResizeProps = PropsWithChildren<
	Mode & {
		width?: number;
		height?: number;
		minWidth?: number;
		minHeight?: number;
		maxWidth?: number;
		maxHeight?: number;
		className?: string;
		style?: React.CSSProperties;
		disabled?: boolean;
		onContainerClick?: (e: React.MouseEvent) => void;
		onContainerMouseDown?: (e: React.MouseEvent) => void;
		onResizeEnd?: (width: Pixels, height: Pixels) => void;
	}
>;

// TODO: aspect ratio
export const Resize = forwardRef<HTMLDivElement, ResizeProps>((props, ref) => {
	const {
		width,
		height,
		minHeight = 0,
		minWidth = 0,
		maxHeight = 1,
		maxWidth = 1,
		children,
		className,
		style,
		disabled,
		onContainerClick,
		onContainerMouseDown,
		onResizeEnd,
	} = props;

	const container =
		(ref as RefObject<HTMLDivElement>) || useRef<HTMLDivElement>(null);

	const handles = useRef(new WeakMap<HTMLDivElement, HandleSide>());
	const activeHandle = useRef<HTMLDivElement>();
	const containerRect = useRef<DOMRect>(null as any);
	const size = useRef({} as Size);

	useLayoutEffect(() => {
		containerDOMSize.width = sizeLimits.clamp(
			width ?? containerDOMSize.width,
			'x'
		);
		containerDOMSize.height = sizeLimits.clamp(
			height ?? containerDOMSize.height,
			'y'
		);
	}, []);

	useEffect(() => {
		if (width && width !== size.current.width) {
			containerDOMSize.width = sizeLimits.clamp(width, 'x');
		}
		if (height && height !== size.current.height) {
			containerDOMSize.height = sizeLimits.clamp(height, 'y');
		}
	}, [width, height]);

	const sizeLimits = useMemo(
		() => ({
			width: {
				get min() {
					return minWidth <= 1
						? minWidth * window.innerWidth
						: minWidth;
				},
				get max() {
					return maxWidth <= 1
						? maxWidth * window.innerWidth
						: maxWidth;
				},
			},
			height: {
				get min() {
					return minHeight <= 1
						? minHeight * window.innerHeight
						: minHeight;
				},

				get max() {
					return maxHeight <= 1
						? maxHeight * window.innerHeight
						: maxHeight;
				},
			},
			clamp: (value: number, axis: 'x' | 'y') => {
				const { width, height } = sizeLimits;
				const min = axis === 'x' ? width.min : height.min;
				const max = axis === 'x' ? width.max : height.max;
				if (value < min) return min;
				if (value > max) return max;
				return value;
			},
		}),
		[minWidth, minHeight, maxWidth, maxHeight]
	);

	const containerDOMSize = useMemo(
		() => ({
			get width() {
				return container.current!.offsetWidth;
			},
			set width(width: number) {
				size.current.width = width;
				requestAnimationFrame(() => {
					if (!container.current) return;
					container.current.style.width = `${width}px`;
				});
			},
			get height() {
				return container.current!.offsetHeight;
			},
			set height(height: number) {
				size.current.height = height;
				requestAnimationFrame(() => {
					if (!container.current) return;
					container.current.style.height = `${height}px`;
				});
			},
		}),
		[]
	);

	const onResize = useCallback((e: MouseEvent) => {
		const { clamp } = sizeLimits;
		const { left, right, top, bottom } = containerRect.current;

		const resizeLeft = () => {
			containerDOMSize.width = clamp(right - e.clientX, 'x');
		};
		const resizeRight = () => {
			containerDOMSize.width = clamp(e.clientX - left, 'x');
		};
		const resizeTop = () => {
			containerDOMSize.height = clamp(bottom - e.clientY, 'y');
		};
		const resizeBottom = () => {
			containerDOMSize.height = clamp(e.clientY - top, 'y');
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

	const setAnchorPoint = useCallback(() => {
		if (props.mode !== 'freeform') return;

		const cnt = container.current!;
		const rect = containerRect.current;
		const position: PartialPosition = {};

		const anchorLeft = () => {
			cnt.style.right = 'auto';
			position.left = toViewportUnits(rect.left, 'x');
		};

		const anchorRight = () => {
			cnt.style.left = 'auto';
			position.right = toViewportUnits(
				window.innerWidth - rect.right,
				'x'
			);
		};

		const anchorTop = () => {
			cnt.style.bottom = 'auto';
			position.top = toViewportUnits(rect.top, 'y');
		};

		const anchorBottom = () => {
			cnt.style.top = 'auto';
			position.bottom = toViewportUnits(
				window.innerHeight - rect.bottom,
				'y'
			);
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

		actions[handles.current.get(activeHandle.current!)!];
		props.onSetAnchor(position);
	}, [(props as Freeform).onSetAnchor]);

	const onGrab = useCallback((e: React.MouseEvent) => {
		containerRect.current = container.current!.getBoundingClientRect();
		activeHandle.current = e.target as HTMLDivElement;
		setAnchorPoint();
		userSelect.disable();
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onResize);
	}, []);

	const onRelease = useCallback(() => {
		userSelect.enable();
		onResizeEnd?.(size.current.width, size.current.height);
		document.removeEventListener('mouseup', onRelease);
		document.removeEventListener('mousemove', onResize);
	}, []);

	return (
		<div
			className={classes.resizeBlock(null, className)}
			ref={container}
			style={style}
			onClick={onContainerClick}
			onMouseDown={onContainerMouseDown}
		>
			{children}
			{!disabled &&
				handleSides.map(
					(side) =>
						(props.mode === 'freeform' || props.side === side) && (
							<div
								key={side}
								className={classes.handleElement({
									[side]: true,
								})}
								ref={(el) =>
									el && handles.current.set(el, side)
								}
								onMouseDown={onGrab}
							/>
						)
				)}
		</div>
	);
});
