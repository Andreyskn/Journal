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

const containerStyle: React.CSSProperties = {
	padding: '0 15px 15px',
	borderRadius: 5,
	backgroundColor: '#00000030',
	zIndex: 1000,
	position: 'fixed',
	...initialPosition,
};

const handlerStyle: React.CSSProperties = {
	height: 15,
	backgroundColor: 'rgb(19 124 189 / 50%)',
	borderRadius: '5px 5px 0 0',
	margin: '0 -15px 10px',
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
		(window as any).requestIdleCallback(() => {
			localStorage.setItem(
				POSITION_STORAGE_KEY,
				JSON.stringify(position)
			);
		});
	});

	const onPositionChange: ResizeProps['onPositionChange'] = (position) => {
		setPosition(position);
	};

	return (
		<Resize
			style={containerStyle}
			className={Classes.DARK}
			mode='freeform'
			ref={containerRef}
			onPositionChange={onPositionChange}
		>
			<div style={handlerStyle} ref={handlerRef} />
			<Button text='Clear state' icon='refresh' onClick={onClear} />
		</Resize>
	);
};

const devRoot = document.createElement('div');
document.body.appendChild(devRoot);

ReactDom.render(<DevOverlay />, devRoot);
