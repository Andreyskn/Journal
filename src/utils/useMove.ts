import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';
import { mergeExcluding, userSelect, toViewportUnits } from './helpers';

type HorizontalAlignment = keyof Pick<CSSStyleDeclaration, 'left' | 'right'>;
type VerticalAlignment = keyof Pick<CSSStyleDeclaration, 'top' | 'bottom'>;
type Alignment = HorizontalAlignment | VerticalAlignment;

type Side<T extends Alignment> = Record<T, ViewportRelativeUnits>;
type Left = Side<'left'>;
type Right = Side<'right'>;
type Top = Side<'top'>;
type Bottom = Side<'bottom'>;

type HorizontalPosition = Right | Left;
type VerticalPosition = Top | Bottom;
export type Position = HorizontalPosition & VerticalPosition;
export type PartialPosition = Partial<Left & Right & Top & Bottom>;

type AlignmentData = {
	sideX: { name: HorizontalAlignment; value: ViewportRelativeUnits };
	sideY: { name: VerticalAlignment; value: ViewportRelativeUnits };
};

type OnMoveEndCallback = (position: Position) => void;

export const useMove = (
	initialPosition: Position,
	onMoveEnd: OnMoveEndCallback
) => {
	const containerRef = useRef<HTMLElement | null>(null);
	const handlerRef = useRef<HTMLElement | null>(null);
	const handler = useRef<HTMLElement | null>(null);
	const grabPoint = useRef<Record<Alignment, Pixels>>(null as any);

	const position = useMemo(
		() => ({
			value: {} as PartialPosition,
			sideX: (null as unknown) as AlignmentData['sideX'],
			sideY: (null as unknown) as AlignmentData['sideY'],
			set: (x: ViewportRelativeUnits, y: ViewportRelativeUnits) => {
				position.value[position.sideX.name] = x;
				position.value[position.sideY.name] = y;
				requestAnimationFrame(() => {
					containerRef.current!.style[position.sideX.name] = `${x}vw`;
					containerRef.current!.style[position.sideY.name] = `${y}vh`;
				});
			},
			init: (newPosition: PartialPosition) => {
				position.value = mergeExcluding<PartialPosition, Alignment>(
					position.value,
					newPosition,
					{
						left: 'right' in newPosition,
						right: 'left' in newPosition,
						bottom: 'top' in newPosition,
						top: 'bottom' in newPosition,
					}
				);

				position.sideX =
					'left' in position.value
						? { name: 'left', value: position.value.left! }
						: {
								name: 'right',
								value: position.value.right!,
						  };

				position.sideY =
					'top' in position.value
						? { name: 'top', value: position.value.top! }
						: {
								name: 'bottom',
								value: position.value.bottom!,
						  };

				position.set(position.sideX.value, position.sideY.value);
			},
		}),
		[]
	);

	useEffect(() => {
		handler.current = handlerRef.current || containerRef.current;
	}, [handlerRef.current, containerRef.current]);

	useLayoutEffect(() => {
		containerRef.current!.style.position = 'fixed';
		position.init(initialPosition);
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
		const { left, right, top, bottom } = grabPoint.current;
		let newX: Pixels;
		let newY: Pixels;

		if (sideX.name === 'left')
			newX = toViewportUnits(e.clientX - left, 'x');
		else newX = toViewportUnits(window.innerWidth - e.clientX - right, 'x');

		if (sideY.name === 'top') newY = toViewportUnits(e.clientY - top, 'y');
		else
			newY = toViewportUnits(
				window.innerHeight - e.clientY - bottom,
				'y'
			);

		position.set(newX, newY);
	}, []);

	const onGrab = useCallback((e: MouseEvent) => {
		const rect = containerRef.current!.getBoundingClientRect();

		grabPoint.current = {
			left: e.clientX - rect.left,
			right: rect.right - e.clientX,
			top: e.clientY - rect.top,
			bottom: rect.bottom - e.clientY,
		};

		userSelect.disable();
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onMove);
	}, []);

	const onRelease = useCallback(() => {
		userSelect.enable();
		onMoveEnd(position.value as Position);
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
	};
};
