import { Button, Classes } from '@blueprintjs/core';
import React from 'react';
import ReactDom from 'react-dom';
import { clear } from 'idb-keyval';

import { useMove, Position } from './useMove';

const style: React.CSSProperties = {
	padding: 15,
	borderRadius: 5,
	backgroundColor: '#00000030',
	zIndex: 1000,
};

const POSITION_STORAGE_KEY = 'journal:dev-overlay-position';

const initialPosition = ((): Position => {
	const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
	if (savedPosition) {
		return JSON.parse(savedPosition) as Position;
	}
	return { bottom: 5, right: 5 };
})();

const DevOverlay: React.FC = () => {
	const { containerRef, onMoveEnd } = useMove(initialPosition);

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

	return (
		<div className={Classes.DARK} style={style} ref={containerRef}>
			<Button text='Clear state' icon='refresh' onClick={onClear} />
		</div>
	);
};

const devRoot = document.createElement('div');
document.body.appendChild(devRoot);

ReactDom.render(<DevOverlay />, devRoot);
