import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { FocusStyleManager } from '@blueprintjs/core';

import { App } from './components/App';
import { store } from './store';

FocusStyleManager.onlyShowFocusOnTabs();

ReactDom.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
