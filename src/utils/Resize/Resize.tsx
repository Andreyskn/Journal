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
import { ORIGIN, userSelect } from '../helpers';
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

type Size = { width: number; height: number };
const stubSize: Size = { width: undefined as any, height: undefined as any };

const emptyWeakMap = new WeakMap<any>();

/**
 * TODO:
 * - min and max size
 * - aspect ratio
 */
export const Resize = forwardRef<HTMLDivElement, ResizeProps>((props, ref) => {
	const {
		initialWidth,
		initialHeight,
		minHeight = 0,
		minWidth = 0,
		maxHeight = 1000,
		maxWidth = 1000,
		children,
		style,
		className,
		onPositionChange,
	} = props;

	const container =
		(ref as RefObject<HTMLDivElement>) || useRef<HTMLDivElement>(null);

	const handles = useRef<WeakMap<HTMLDivElement, HandleSide>>(emptyWeakMap);
	const size = useRef(stubSize);
	const lastMousePos = useRef(ORIGIN);
	const activeHandle = useRef<HTMLDivElement>();

	useLayoutEffect(() => {
		size.current.width = initialWidth ?? containerSize.width;
		size.current.height = initialHeight ?? containerSize.height;
	}, []);

	const containerSize = useMemo(
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
		const { width, height } = size.current;
		let newWidth!: number;
		let newHeight!: number;

		const resizeLeft = () => {
			newWidth = width + lastMousePos.current.x - e.clientX;
		};
		const resizeRight = () => {
			newWidth = width + e.clientX - lastMousePos.current.x;
		};
		const resizeTop = () => {
			newHeight = height + lastMousePos.current.y - e.clientY;
		};
		const resizeBottom = () => {
			newHeight = height + e.clientY - lastMousePos.current.y;
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

		if (newWidth >= minWidth && newWidth <= maxWidth) {
			size.current.width = newWidth;
			containerSize.width = size.current.width;
		}

		if (newHeight >= minHeight && newHeight <= maxHeight) {
			size.current.height = newHeight;
			containerSize.height = size.current.height;
		}

		lastMousePos.current.x = e.clientX;
		lastMousePos.current.y = e.clientY;
	}, []);

	const setAnchorPoint = (handle: HTMLDivElement) => {
		const cnt = container.current!;
		const rect = cnt.getBoundingClientRect();
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
		if (props.mode === 'freeform') {
			setAnchorPoint(e.target as HTMLDivElement);
		}
		activeHandle.current = e.target as HTMLDivElement;
		userSelect.disable(document.body);
		lastMousePos.current = { x: e.clientX, y: e.clientY };
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onResize);
	}, []);

	const onRelease = useCallback(() => {
		userSelect.enable(document.body);
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
