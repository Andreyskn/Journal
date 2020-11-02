import React from 'react';
import { clear } from 'idb-keyval';
import { Button } from '@blueprintjs/core';

const DevTools: React.FC = () => {
	const onClear = () => {
		clear().then(() => document.location.reload());
	};

	return <Button text='Clear state' icon='refresh' onClick={onClear} />;
};

const windowModule: App.WindowModule = {
	id: 'dev',
	icon: 'code',
	title: 'Dev',
	Content: DevTools,
	menuEntry: {
		order: Infinity,
	},
};

export const { id, icon, title, Content, menuEntry } = windowModule;
