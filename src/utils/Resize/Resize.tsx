import React, {
	forwardRef,
	PropsWithChildren,
	RefObject,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';

import './resize.scss';

import { bem } from '../bem';
import { userSelect } from '../helpers';
import { PartialPosition } from '../useMove';

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

export type ResizeProps = PropsWithChildren<
	Mode & {
		initialWidth?: number;
		initialHeight?: number;
		minWidth?: number;
		minHeight?: number;
		maxWidth?: number;
		maxHeight?: number;
		style?: React.CSSProperties;
		className?: string;
		onPositionChange?: (position: PartialPosition) => void;
	}
>;

const emptyWeakMap = new WeakMap<any>();

// TODO: aspect ratio
export const Resize = forwardRef<HTMLDivElement, ResizeProps>((props, ref) => {
	const {
		initialWidth,
		initialHeight,
		minHeight = 0,
		minWidth = 0,
		maxHeight = 1,
		maxWidth = 1,
		children,
		style,
		className,
		onPositionChange,
	} = props;

	const container =
		(ref as RefObject<HTMLDivElement>) || useRef<HTMLDivElement>(null);

	const handles = useRef<WeakMap<HTMLDivElement, HandleSide>>(emptyWeakMap);
	const activeHandle = useRef<HTMLDivElement>();
	const initialContainerRect = useRef<DOMRect>(null as any);

	useLayoutEffect(() => {
		if (initialWidth || containerDOMSize.width < sizeLimits.width.min) {
			containerDOMSize.width = initialWidth ?? sizeLimits.width.min;
		}
		if (initialHeight || containerDOMSize.height < sizeLimits.height.min) {
			containerDOMSize.height = initialHeight ?? sizeLimits.height.min;
		}
	}, []);

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
		}),
		[minWidth, minHeight, maxWidth, maxHeight]
	);

	const containerDOMSize = useMemo(
		() => ({
			get width() {
				return container.current!.offsetWidth;
			},
			set width(width: number) {
				requestAnimationFrame(() => {
					container.current!.style.width = `${width}px`;
				});
			},
			get height() {
				return container.current!.offsetHeight;
			},
			set height(height: number) {
				requestAnimationFrame(() => {
					container.current!.style.height = `${height}px`;
				});
			},
		}),
		[]
	);

	const onResize = useCallback((e: MouseEvent) => {
		const { width, height } = sizeLimits;
		const { left, right, top, bottom } = initialContainerRect.current;

		const clamp = (value: number, min: number, max: number) => {
			if (value < min) return min;
			if (value > max) return max;
			return value;
		};

		const resizeLeft = () => {
			containerDOMSize.width = clamp(
				right - e.clientX,
				width.min,
				width.max
			);
		};
		const resizeRight = () => {
			containerDOMSize.width = clamp(
				e.clientX - left,
				width.min,
				width.max
			);
		};
		const resizeTop = () => {
			containerDOMSize.height = clamp(
				bottom - e.clientY,
				height.min,
				height.max
			);
		};
		const resizeBottom = () => {
			containerDOMSize.height = clamp(
				e.clientY - top,
				height.min,
				height.max
			);
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
		const rect = initialContainerRect.current;
		const position: PartialPosition = {};

		const anchorLeft = () => {
			cnt.style.right = 'auto';
			const left = rect.left;
			cnt.style.left = `${left}px`;
			position.left = left;
		};

		const anchorRight = () => {
			cnt.style.left = 'auto';
			const right = window.innerWidth - rect.right;
			cnt.style.right = `${right}px`;
			position.right = right;
		};

		const anchorTop = () => {
			cnt.style.bottom = 'auto';
			const top = rect.top;
			cnt.style.top = `${rect.top}px`;
			position.top = top;
		};

		const anchorBottom = () => {
			cnt.style.top = 'auto';
			const bottom = window.innerHeight - rect.bottom;
			cnt.style.bottom = `${bottom}px`;
			position.bottom = bottom;
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
		onPositionChange?.(position);
	};

	const onGrab = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		initialContainerRect.current = container.current!.getBoundingClientRect();
		if (props.mode === 'freeform') {
			setAnchorPoint(e.target as HTMLDivElement);
		}
		activeHandle.current = e.target as HTMLDivElement;
		userSelect.disable();
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onResize);
	}, []);

	const onRelease = useCallback(() => {
		userSelect.enable();
		document.removeEventListener('mouseup', onRelease);
		document.removeEventListener('mousemove', onResize);
	}, []);

	return (
		<div
			style={{
				...style,
				position: props.mode === 'freeform' ? 'fixed' : 'relative',
			}}
			className={classes.resizeBlock(null, className)}
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
});
