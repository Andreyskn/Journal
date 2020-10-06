import React, { useMemo } from 'react';

import { useSelector, useDispatch } from '../../core';
import { Tabs } from './Tabs';
import { dispatchers } from './dispatcher';
import { ErrorBoundary } from '../../utils';

const WrappedTabs = React.memo(Tabs);

export const TabsConnector: React.FC = () => {
	const { tabs, activeTabId } = useSelector((state) => ({
		tabs: state.tabs,
		activeTabId: state.activeFile.ref?.id,
	}));

	const tabsArray = useMemo(() => tabs.valueSeq().toArray(), [tabs]);
	const dispatch = useDispatch(dispatchers);

	return (
		<ErrorBoundary name='Tabs'>
			<WrappedTabs
				tabs={tabsArray}
				activeTabId={activeTabId}
				dispatch={dispatch}
			/>
		</ErrorBoundary>
	);
};
