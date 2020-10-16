import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';
import { noop } from './helpers';

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

const isLeft = (pos: Position): pos is Left & VerticalPosition => 'left' in pos;
const isTop = (pos: Position): pos is Top & HorizontalPosition => 'top' in pos;

type AlignmentData<T> = {
	side: T;
	adjust: (amount: number) => void;
};

const stubMousePos: Coordinates = { x: 0, y: 0 };

type OnMoveEndCallback<P extends Position> = (position: P) => void;

// TODO:
// forbid moving items past screen edge
// handle window resize
// add css class for disabling user-select
export const useMove = <P extends Position>(initPos: P) => {
	const containerRef = useRef<HTMLElement | null>(null);
	const handlerRef = useRef<HTMLElement | null>(null);
	const handler = useRef<HTMLElement | null>(null);
	const position = useRef<P>(initPos);
	const lastMousePos = useRef<Coordinates>(stubMousePos);
	const onMoveEndCallback = useRef<OnMoveEndCallback<P>>(noop);

	const alignment = useMemo(() => {
		const inc = (side: Alignment) => (amount: number) =>
			//@ts-ignore
			(position.current[side] += amount);
		const dec = (side: Alignment) => (amount: number) =>
			//@ts-ignore
			(position.current[side] -= amount);

		const h: AlignmentData<HorizontalAlignment> = isLeft(position.current)
			? { side: 'left', adjust: inc('left') }
			: { side: 'right', adjust: dec('right') };

		const v: AlignmentData<VerticalAlignment> = isTop(position.current)
			? { side: 'top', adjust: inc('top') }
			: { side: 'bottom', adjust: dec('bottom') };

		return {
			h: h as AlignmentData<keyof P>,
			v: v as AlignmentData<keyof P>,
		};
	}, []);

	useEffect(() => {
		handler.current = handlerRef.current || containerRef.current;
	}, [handlerRef.current, containerRef.current]);

	const applyPositionStyles = useCallback((container: HTMLElement) => {
		const pos = position.current;
		const { h, v } = alignment;
		container.style[h.side as HorizontalAlignment] = `${pos[h.side]}px`;
		container.style[v.side as VerticalAlignment] = `${pos[v.side]}px`;
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

		alignment.h.adjust(deltaX);
		alignment.v.adjust(deltaY);

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

	const onMoveEnd = (callback: OnMoveEndCallback<P>) => {
		onMoveEndCallback.current = callback;
	};

	return {
		containerRef: containerRef as React.RefObject<any>,
		handlerRef: handlerRef as React.RefObject<any>,
		onMoveEnd,
	};
};
