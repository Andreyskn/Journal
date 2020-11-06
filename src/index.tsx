import 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';
import { clear } from 'idb-keyval';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { FocusStyleManager, Toaster, Intent } from '@blueprintjs/core';

import { initStore } from './core';
import { App } from './components/App';

const onClear = () => {
	clear().then(() => document.location.reload());
};

if (process.env.NODE_ENV === 'development') {
	window.onerror = (message) => {
		setTimeout(() => {
			Toaster.create().show({
				message,
				icon: 'error',
				intent: Intent.DANGER,
				action: {
					text: 'Clear state',
					icon: 'refresh',
					onClick: onClear,
				},
			});
		});
	};
}

FocusStyleManager.onlyShowFocusOnTabs();

initStore();

ReactDom.render(<App />, document.getElementById('root'));
