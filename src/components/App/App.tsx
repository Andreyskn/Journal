import React from 'react';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { Tabs } from '../Tabs';
import { Viewer } from '../Viewer';
import { useAppContextProvider } from '../context';

const [appBlock, appElement] = useBEM('app');

export const App: React.FC = hot(() => {
	const { AppContextProvider } = useAppContextProvider();

	return (
		<AppContextProvider>
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
		</AppContextProvider>
	);
});
