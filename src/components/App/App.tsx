import React from 'react';
import { dispatch, useSelector } from '../../core/store';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { Tabs } from '../Tabs';
import { plugins } from '../../core/pluginManager';

const [appBlock, appElement] = useBEM('app');

const Fallback: React.FC = () => null;

export const App: React.FC = hot(() => {
	const state = useSelector((state) => state);

	// TODO: add selectors with error handling
	const activeFile =
		state.activeFile.id &&
		(state.files.get(state.activeFile.id) as App.RegularFile);
	const activeDocument = activeFile && state.data.get(activeFile.data);

	const Workspace = activeDocument
		? plugins.get((activeFile as App.RegularFile).type)!.component
		: Fallback;

	return (
		<div className={appBlock(null, Classes.DARK)}>
			<div className={appElement('file-tree')}>
				<FileTree />
			</div>
			<div className={appElement('tabs')}>
				<Tabs />
			</div>
			<div className={appElement('workspace')}>
				<Workspace data={activeDocument as any} dispatch={dispatch} />
			</div>
		</div>
	);
});
