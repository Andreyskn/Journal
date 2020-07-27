import React, { useMemo } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';

import { Tabs } from './Tabs';
import { createDispatch } from './tabsDispatch';

export const TabsConnector: React.FC = () => {
	const store = useStore<Model.ImmutableAppState, Model.AppAction>();

	const { tabs, files, activeFilePath } = useSelector<
		Model.ImmutableAppState,
		Model.TabsState &
			Pick<Model.FileSystemState, 'activeFilePath' | 'files'>
	>(state => ({
		tabs: state.tabs,
		activeFilePath: state.activeFilePath,
		files: state.files,
	}));

	const tabsArray = useMemo(() => tabs.toArray(), [tabs]);
	const tabsDispatch = useMemo(() => createDispatch({ store }), [store]);

	return (
		<Tabs
			tabs={tabsArray}
			files={files}
			activeFilePath={activeFilePath}
			dispatch={tabsDispatch}
		/>
	);
};
