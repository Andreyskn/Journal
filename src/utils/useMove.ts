import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';
import { mergeExcluding, noop, userSelect } from './helpers';

type Pixels = number;
type Percentage = number;

type HorizontalAlignment = keyof Pick<CSSStyleDeclaration, 'left' | 'right'>;
type VerticalAlignment = keyof Pick<CSSStyleDeclaration, 'top' | 'bottom'>;
type Alignment = HorizontalAlignment | VerticalAlignment;

type Side<T extends Alignment> = Record<T, Pixels | Percentage>;
type Left = Side<'left'>;
type Right = Side<'right'>;
type Top = Side<'top'>;
type Bottom = Side<'bottom'>;

type HorizontalPosition = Right | Left;
type VerticalPosition = Top | Bottom;
export type Position = HorizontalPosition & VerticalPosition;
export type PartialPosition = Partial<Left & Right & Top & Bottom>;

type AlignmentData = {
	sideX: { name: HorizontalAlignment; value: Percentage };
	sideY: { name: VerticalAlignment; value: Percentage };
};

type GrabOffset = Record<Alignment, Pixels>;

type OnMoveEndCallback = (position: Position) => void;

const pixelsToPercentage = (side: Alignment, value: Pixels): Percentage => {
	return (
		(value /
			(side === 'left' || side === 'right'
				? window.innerWidth
				: window.innerHeight)) *
		100
	);
};

const percentageToPixels = (side: Alignment, value: Percentage): Pixels => {
	return (
		(value / 100) *
		(side === 'left' || side === 'right'
			? window.innerWidth
			: window.innerHeight)
	);
};

const toRelative = (position: PartialPosition) => {
	return Object.keys(position).reduce((result, side) => {
		//@ts-ignore
		result[side] = pixelsToPercentage(side, position[side]);
		return result;
	}, {} as PartialPosition);
};

const toAbsolute = (position: PartialPosition) => {
	return Object.keys(position).reduce((result, side) => {
		//@ts-ignore
		result[side] = percentageToPixels(side, position[side]);
		return result;
	}, {} as Position);
};

export const useMove = (initPos: Position) => {
	const containerRef = useRef<HTMLElement | null>(null);
	const handlerRef = useRef<HTMLElement | null>(null);
	const handler = useRef<HTMLElement | null>(null);

	const grabOffset = useRef<GrabOffset>(null as any);
	const onMoveEndCallback = useRef<OnMoveEndCallback>(noop);

	const position = useMemo(() => {
		let relativePosition: PartialPosition = {};

		const set = (x: Percentage, y: Percentage) => {
			relativePosition[position.sideX.name] = x;
			relativePosition[position.sideY.name] = y;
			requestAnimationFrame(() => {
				containerRef.current!.style[position.sideX.name] = x + '%';
				containerRef.current!.style[position.sideY.name] = y + '%';
			});
		};

		const init = (newPosition: PartialPosition) => {
			relativePosition = mergeExcluding<PartialPosition, Alignment>(
				relativePosition,
				toRelative(newPosition),
				{
					left: 'right' in newPosition,
					right: 'left' in newPosition,
					bottom: 'top' in newPosition,
					top: 'bottom' in newPosition,
				}
			);

			position.sideX =
				'left' in relativePosition
					? { name: 'left', value: relativePosition.left! }
					: {
							name: 'right',
							value: relativePosition.right!,
					  };

			position.sideY =
				'top' in relativePosition
					? { name: 'top', value: relativePosition.top! }
					: {
							name: 'bottom',
							value: relativePosition.bottom!,
					  };

			set(position.sideX.value, position.sideY.value);
		};

		return {
			sideX: (null as unknown) as AlignmentData['sideX'],
			sideY: (null as unknown) as AlignmentData['sideY'],
			set,
			init,
			get absolute() {
				return toAbsolute(relativePosition);
			},
		};
	}, []);

	useEffect(() => {
		handler.current = handlerRef.current || containerRef.current;
	}, [handlerRef.current, containerRef.current]);

	useLayoutEffect(() => {
		containerRef.current!.style.position = 'fixed';
		containerRef.current!.style.willChange = 'left, right, top, bottom';
		position.init(initPos);
	}, []);

	const onMove = useCallback((e: MouseEvent) => {
		if (
			e.clientX < 0 ||
			e.clientX > window.innerWidth ||
			e.clientY < 0 ||
			e.clientY > window.innerHeight
		) {
			return;
		}

		const { sideX, sideY } = position;
		const { left, right, top, bottom } = grabOffset.current;
		let newX: Pixels;
		let newY: Pixels;

		if (sideX.name === 'left') newX = e.clientX - left;
		else newX = window.innerWidth - e.clientX - right;

		if (sideY.name === 'top') newY = e.clientY - top;
		else newY = window.innerHeight - e.clientY - bottom;

		position.set(
			pixelsToPercentage(sideX.name, newX),
			pixelsToPercentage(sideY.name, newY)
		);
	}, []);

	const onGrab = useCallback((e: MouseEvent) => {
		const {
			left,
			right,
			top,
			bottom,
		} = containerRef.current!.getBoundingClientRect();

		grabOffset.current = {
			left: e.clientX - left,
			right: right - e.clientX,
			top: e.clientY - top,
			bottom: bottom - e.clientY,
		};

		userSelect.disable(document.body);
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onMove);
	}, []);

	const onRelease = useCallback(() => {
		userSelect.enable(document.body);
		onMoveEndCallback.current(position.absolute);
		document.removeEventListener('mouseup', onRelease);
		document.removeEventListener('mousemove', onMove);
	}, []);

	useEffect(() => {
		handler.current?.addEventListener('mousedown', onGrab);
		return () => {
			handler.current?.removeEventListener('mousedown', onGrab);
		};
	}, [handler.current]);

	return {
		containerRef: containerRef as React.RefObject<any>,
		handlerRef: handlerRef as React.RefObject<any>,
		setPosition: position.init,
		onMoveEnd: useCallback((callback: OnMoveEndCallback) => {
			onMoveEndCallback.current = callback;
		}, []),
	};
};
