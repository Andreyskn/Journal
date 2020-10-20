import { Button } from '@blueprintjs/core';
import React from 'react';
import ReactDom from 'react-dom';
import { clear } from 'idb-keyval';

import { Window, WindowProps } from './Window/Window';

const POSITION_STORAGE_KEY = 'journal:dev-overlay-position';

const initialPosition = (() => {
	const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
	if (savedPosition) {
		return JSON.parse(savedPosition) as WindowProps['initialPosition'];
	}
})();

const DevOverlay: React.FC = () => {
	const onClear = () => {
		clear().then(() => document.location.reload());
	};

	const onReposition: WindowProps['onReposition'] = (position) => {
		(window as any).requestIdleCallback(() => {
			localStorage.setItem(
				POSITION_STORAGE_KEY,
				JSON.stringify(position)
			);
		});
	};

	return (
		<Window
			title='Dev'
			icon='code'
			onReposition={onReposition}
			initialPosition={initialPosition}
		>
			<Button text='Clear state' icon='refresh' onClick={onClear} />
		</Window>
	);
};

const devRoot = document.createElement('div');
document.body.appendChild(devRoot);

ReactDom.render(<DevOverlay />, devRoot);
