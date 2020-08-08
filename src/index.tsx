import 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { FocusStyleManager, Toaster, Intent } from '@blueprintjs/core';

import { App } from './components/App';
import { store } from './store';

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

ReactDom.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
