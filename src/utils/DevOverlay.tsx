import { Button, ButtonGroup, Classes } from '@blueprintjs/core';
import React, { useState } from 'react';
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
	...initialPosition,
};

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

	const [side, setSide] = useState<any>('bottom');

	return (
		<div className={Classes.DARK}>
			<Resize style={style} mode='freeform' key={side}>
				{/* <Resize style={style} mode='directed' side={side} key={side}> */}
				{/* <Button text='Clear state' icon='refresh' onClick={onClear} /> */}
				<ButtonGroup>
					<Button
						text='left'
						onClick={() => setSide('left')}
						active={side === 'left'}
					/>
					<Button
						text='right'
						onClick={() => setSide('right')}
						active={side === 'right'}
					/>
					<Button
						text='top'
						onClick={() => setSide('top')}
						active={side === 'top'}
					/>
					<Button
						text='bottom'
						onClick={() => setSide('bottom')}
						active={side === 'bottom'}
					/>
				</ButtonGroup>
			</Resize>
		</div>
	);
};

const devRoot = document.createElement('div');
document.body.appendChild(devRoot);

ReactDom.render(<DevOverlay />, devRoot);
