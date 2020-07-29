import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { TaskList } from '../TaskList';
import { Tabs } from '../Tabs';

const [appBlock, appElement] = useBEM('app');

export const App: React.FC = hot(() => {
	const state = useSelector<Model.ImmutableAppState, Model.ImmutableAppState>(
		state => state
	);

	useEffect(() => {
		(window as any).saveState = () =>
			localStorage.setItem('state', JSON.stringify(state));
	}, [state]);

	// TODO: add selectors with error handling
	const activeFile =
		state.activeFilePath &&
		state.getIn(state.files.get(state.activeFilePath)!.path.content);

	return (
		<div className={appBlock(null, Classes.DARK)}>
			<div className={appElement('file-tree')}>
				<FileTree />
			</div>
			<div className={appElement('tabs')}>
				<Tabs />
			</div>
			<div className={appElement('workspace')}>
				{activeFile && <TaskList taskList={activeFile} />}
			</div>
		</div>
	);
});
