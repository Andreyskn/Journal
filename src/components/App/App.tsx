import React from 'react';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { bem } from '../../utils';
import { FileTree } from '../FileTree';
import { Tabs } from '../Tabs';
import { Viewer } from '../Viewer';
import { useAppContextProvider } from '../context';

const classes = bem('app', ['file-tree', 'tabs', 'viewer'] as const);

export const App: React.FC = hot(() => {
	const { AppContextProvider } = useAppContextProvider();

	return (
		<AppContextProvider>
			<div className={classes.appBlock(null, Classes.DARK)}>
				<div className={classes.fileTreeElement()}>
					<FileTree />
				</div>
				<div className={classes.tabsElement()}>
					<Tabs />
				</div>
				<div className={classes.viewerElement()}>
					<Viewer />
				</div>
			</div>
		</AppContextProvider>
	);
});
