import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';
import { mergeExcluding, noop, ORIGIN } from './helpers';

type HorizontalAlignment = keyof Pick<CSSStyleDeclaration, 'left' | 'right'>;
type VerticalAlignment = keyof Pick<CSSStyleDeclaration, 'top' | 'bottom'>;
type Alignment = HorizontalAlignment | VerticalAlignment;

type Side<T extends Alignment> = Record<T, number>;
type Left = Side<'left'>;
type Right = Side<'right'>;
type Top = Side<'top'>;
type Bottom = Side<'bottom'>;

type HorizontalPosition = Right | Left;
type VerticalPosition = Top | Bottom;
export type Position = HorizontalPosition & VerticalPosition;
export type PartialPosition = Partial<Left & Right & Top & Bottom>;

type AlignmentData = {
	h: { side: HorizontalAlignment; adjust: (amount: number) => void };
	v: { side: VerticalAlignment; adjust: (amount: number) => void };
};

type OnMoveEndCallback = (position: Position) => void;

// TODO:
// forbid moving items past screen edge
// handle window resize (set position in percents)
// add css class for disabling user-select
export const useMove = (initPos: Position) => {
	const containerRef = useRef<HTMLElement | null>(null);
	const handlerRef = useRef<HTMLElement | null>(null);
	const handler = useRef<HTMLElement | null>(null);

	const position = useRef(initPos);
	const lastMousePos = useRef(ORIGIN);
	const onMoveEndCallback = useRef<OnMoveEndCallback>(noop);

	const getAlignmentData = useCallback((): AlignmentData => {
		const inc = (side: Alignment) => (amount: number) =>
			//@ts-ignore
			(position.current[side] += amount);
		const dec = (side: Alignment) => (amount: number) =>
			//@ts-ignore
			(position.current[side] -= amount);

		const h: AlignmentData['h'] =
			'left' in position.current
				? { side: 'left', adjust: inc('left') }
				: { side: 'right', adjust: dec('right') };

		const v: AlignmentData['v'] =
			'top' in position.current
				? { side: 'top', adjust: inc('top') }
				: { side: 'bottom', adjust: dec('bottom') };

		return { h, v };
	}, []);

	const alignmentData = useRef(useMemo(getAlignmentData, []));

	//#region public calls

	const setPosition = (newPosition: PartialPosition) => {
		position.current = mergeExcluding<Position, Alignment>(
			position.current,
			newPosition as Position,
			{
				left: 'right' in newPosition,
				right: 'left' in newPosition,
				bottom: 'top' in newPosition,
				top: 'bottom' in newPosition,
			}
		);

		alignmentData.current = getAlignmentData();
	};

	const onMoveEnd = (callback: OnMoveEndCallback) => {
		onMoveEndCallback.current = callback;
	};

	//#endregion

	useEffect(() => {
		handler.current = handlerRef.current || containerRef.current;
	}, [handlerRef.current, containerRef.current]);

	const applyPositionStyles = useCallback((container: HTMLElement) => {
		requestAnimationFrame(() => {
			const pos = position.current;
			const { h, v } = alignmentData.current;
			container.style[h.side] = `${pos[h.side as keyof typeof pos]}px`;
			container.style[v.side] = `${pos[v.side as keyof typeof pos]}px`;
		});
	}, []);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.style.position = 'fixed';
			applyPositionStyles(container);
		}
	}, []);

	const onMove = useCallback((e: MouseEvent) => {
		const deltaX = e.clientX - lastMousePos.current.x;
		const deltaY = e.clientY - lastMousePos.current.y;

		lastMousePos.current.x = e.clientX;
		lastMousePos.current.y = e.clientY;

		alignmentData.current.h.adjust(deltaX);
		alignmentData.current.v.adjust(deltaY);

		applyPositionStyles(containerRef.current as HTMLElement);
	}, []);

	const onGrab = useCallback((e: MouseEvent) => {
		lastMousePos.current = { x: e.clientX, y: e.clientY };
		document.body.style.userSelect = 'none';
		document.addEventListener('mouseup', onRelease);
		document.addEventListener('mousemove', onMove);
	}, []);

	const onRelease = useCallback(() => {
		document.body.removeAttribute('style');
		onMoveEndCallback.current(position.current);
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
		onMoveEnd,
		setPosition,
	};
};
