import React from 'react';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { Tabs } from '../Tabs';
import { Viewer } from '../Viewer';
import { AppContext, AppContextValue, useAlert } from '../context';

const [appBlock, appElement] = useBEM('app');

export const App: React.FC = hot(() => {
	const { Alert, showAlert } = useAlert();

	const contextValue: AppContextValue = {
		showAlert,
	};

	return (
		<AppContext.Provider value={contextValue}>
			<Alert />
			<div className={appBlock(null, Classes.DARK)}>
				<div className={appElement('file-tree')}>
					<FileTree />
				</div>
				<div className={appElement('tabs')}>
					<Tabs />
				</div>
				<div className={appElement('viewer')}>
					<Viewer />
				</div>
			</div>
		</AppContext.Provider>
	);
});
