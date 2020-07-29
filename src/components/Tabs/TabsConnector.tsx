import React, { useMemo } from 'react';
import { useSelector, useStore } from 'react-redux';

import { Tabs } from './Tabs';
import { createDispatch } from './tabsDispatcher';
import { withErrorBoundary } from '../../utils';

const WrappedTabs = React.memo(withErrorBoundary(Tabs));

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
		<WrappedTabs
			tabs={tabsArray}
			files={files}
			activeFilePath={activeFilePath}
			dispatch={tabsDispatch}
		/>
	);
};
