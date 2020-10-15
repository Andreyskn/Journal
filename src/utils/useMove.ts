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
	adjust: (amount: number) => any;
};

type MousePos = { x: number; y: number };
const stubMousePos: MousePos = { x: 0, y: 0 };

type OnMoveEndCallback<P extends Position> = (position: P) => void;

// TODO: forbid moving items past screen edge, handle window resize
export const useMove = <P extends Position>(initPos: P) => {
	const containerRef = useRef<HTMLElement | null>(null);
	const handlerRef = useRef<HTMLElement | null>(null);
	const handler = useRef<HTMLElement | null>(null);
	const position = useRef<P>(initPos);
	const lastMousePos = useRef<MousePos>(stubMousePos);
	const onMoveEndCallback = useRef<OnMoveEndCallback<P>>(noop);

	const alignment = useMemo((): {
		h: AlignmentData<keyof P>;
		v: AlignmentData<keyof P>;
	} => {
		const pos = position.current;
		const inc = (v1: number) => (v2: number) => (v1 += v2);
		const dec = (v1: number) => (v2: number) => (v1 -= v2);

		const h: AlignmentData<HorizontalAlignment> = isLeft(pos)
			? { side: 'left', adjust: inc(pos.left) }
			: { side: 'right', adjust: dec((pos as Right).right) };

		const v: AlignmentData<VerticalAlignment> = isTop(pos)
			? { side: 'top', adjust: inc(pos.top) }
			: { side: 'bottom', adjust: dec((pos as Bottom).bottom) };

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

		const pos = position.current;
		pos[alignment.h.side] = alignment.h.adjust(deltaX);
		pos[alignment.v.side] = alignment.v.adjust(deltaY);

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
			onRelease();
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
