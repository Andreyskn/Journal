import React from 'react';
import { useSelector } from 'react-redux';

import './browser.scss';

import { useBEM } from '../../utils';
import { TaskList } from '../TaskList';
import { Tabs } from '../Tabs';

export type BrowserProps = {};

const [browserBlock, browserElement] = useBEM('browser');

export const Browser: React.FC<BrowserProps> = () => {
	const state = useSelector<Model.ImmutableAppState, Model.ImmutableAppState>(
		state => state
	);

	const activeFile =
		state.activeFilePath &&
		state.getIn(state.files.get(state.activeFilePath)!.path.content);

	return (
		<div className={browserBlock()}>
			<Tabs />
			{activeFile && <TaskList taskList={activeFile} />}
		</div>
	);
};
