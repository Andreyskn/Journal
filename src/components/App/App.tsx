import React from 'react';
import { useSelector } from '../../core/store';
import { hot } from 'react-hot-loader/root';

import './app.scss';

import { Classes } from '@blueprintjs/core';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { TaskList } from '../TaskList';
import { Tabs } from '../Tabs';

const [appBlock, appElement] = useBEM('app');

export const App: React.FC = hot(() => {
	const state = useSelector((state) => state);

	// TODO: add selectors with error handling
	const activeDocument =
		state.activeFile.id &&
		state.data.get(
			(state.files.get(state.activeFile.id) as App.RegularFile).data
		);

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
