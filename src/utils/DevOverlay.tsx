import { Button, Classes } from '@blueprintjs/core';
import React from 'react';
import ReactDom from 'react-dom';
import { clear } from 'idb-keyval';

const style: React.CSSProperties = {
	position: 'fixed',
	bottom: 5,
	right: 5,
	padding: 15,
	borderRadius: 5,
	backgroundColor: '#00000030',
};

const DevOverlay: React.FC = () => {
	const onClear = () => {
		clear().then(() => document.location.reload());
	};

	return (
		<div className={Classes.DARK} style={style}>
			<Button text='Clear state' icon='refresh' onClick={onClear} />
		</div>
	);
};

const devRoot = document.createElement('div');
document.body.appendChild(devRoot);

ReactDom.render(<DevOverlay />, devRoot);
