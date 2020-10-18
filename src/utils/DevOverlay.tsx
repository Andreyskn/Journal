import { Button, Classes } from '@blueprintjs/core';
import React from 'react';
import ReactDom from 'react-dom';
import { clear } from 'idb-keyval';

import { useMove, Position } from './useMove';
import { Resize, ResizeProps } from './Resize/Resize';

const POSITION_STORAGE_KEY = 'journal:dev-overlay-position';

const initialPosition = ((): Position => {
	const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
	if (savedPosition) {
		return JSON.parse(savedPosition) as Position;
	}
	return { bottom: 150, left: 150 };
})();

const style: React.CSSProperties = {
	padding: 15,
	borderRadius: 5,
	backgroundColor: '#00000030',
	zIndex: 1000,
	position: 'fixed',
};

// TODO: add generic Window component
const DevOverlay: React.FC = () => {
	const { containerRef, handlerRef, onMoveEnd, setPosition } = useMove(
		initialPosition
	);

	const onClear = () => {
		clear().then(() => document.location.reload());
	};

	onMoveEnd((position) => {
		// (window as any).requestIdleCallback(() => {
		// 	localStorage.setItem(
		// 		POSITION_STORAGE_KEY,
		// 		JSON.stringify(position)
		// 	);
		// });
	});

	const onPositionChange: ResizeProps['onPositionChange'] = (position) => {
		setPosition(position);
	};

	return (
		<Resize
			style={style}
			className={Classes.DARK}
			mode='freeform'
			ref={containerRef}
			onPositionChange={onPositionChange}
		>
			<div
				style={{ height: 15, background: 'white', marginBottom: 10 }}
				ref={handlerRef}
			/>
			<Button text='Clear state' icon='refresh' onClick={onClear} />
		</Resize>
	);
};

const devRoot = document.createElement('div');
document.body.appendChild(devRoot);

ReactDom.render(<DevOverlay />, devRoot);
