import React, { useMemo } from 'react';
import { useSelector, useStore } from 'react-redux';

import { Tabs } from './Tabs';
import { createDispatch } from './dispatcher';
import { withErrorBoundary } from '../../utils';

const WrappedTabs = React.memo(withErrorBoundary(Tabs));

export const TabsConnector: React.FC = () => {
	const store = useStore<App.ImmutableAppState, Actions.AppAction>();

	const { tabs, activeTabId } = useSelector<
		App.ImmutableAppState,
		App.TabsState & { activeTabId: App.FileSystemState['activeFile']['id'] }
	>((state) => ({
		tabs: state.tabs,
		activeTabId: state.activeFile.id,
	}));

	const tabsArray = useMemo(() => tabs.valueSeq().toArray(), [tabs]);
	const tabsDispatch = useMemo(() => createDispatch({ store }), [store]);

	return (
		<WrappedTabs
			tabs={tabsArray}
			activeTabId={activeTabId}
			dispatch={tabsDispatch}
		/>
	);
};
