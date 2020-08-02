import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { useBEM, isFolderPath } from '../../utils';
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

	const [
		activeDocument,
		setActiveDocument,
	] = useState<Model.ImmutableTaskList | null>(null);

	const getActiveDocument = () => {
		const selectedPath = state.activeFilePath;
		if (!selectedPath) return null;
		if (isFolderPath(selectedPath)) return activeDocument;
		return state.getIn(state.files.get(selectedPath)!.path.content);
	};

	useEffect(() => {
		setActiveDocument(getActiveDocument());
	}, [state.activeFilePath]);

	return (
		<div className={appBlock(null, Classes.DARK)}>
			<div className={appElement('file-tree')}>
				<FileTree />
			</div>
			<div className={appElement('tabs')}>
				<Tabs />
			</div>
			<div className={appElement('workspace')}>
				{activeDocument && <TaskList taskList={activeDocument} />}
			</div>
		</div>
	);
});
