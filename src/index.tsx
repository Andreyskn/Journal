import 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { FocusStyleManager, Toaster, Intent } from '@blueprintjs/core';

import { App } from './components/App';

FocusStyleManager.onlyShowFocusOnTabs();

if (process.env.NODE_ENV === 'development') {
	window.onerror = (message) => {
		setTimeout(() => {
			Toaster.create().show({
				message,
				icon: 'error',
				intent: Intent.DANGER,
			});
		});
	};
}

ReactDom.render(<App />, document.getElementById('root'));
