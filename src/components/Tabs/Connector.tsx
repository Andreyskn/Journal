import React, { useMemo } from 'react';
import { useSelector, useDispatch } from '../../core/store';

import { Tabs } from './Tabs';
import { dispatchers } from './dispatcher';
import { withErrorBoundary } from '../../utils';

const WrappedTabs = React.memo(withErrorBoundary(Tabs));

export const TabsConnector: React.FC = () => {
	const { tabs, activeTabId } = useSelector((state) => ({
		tabs: state.tabs,
		activeTabId: state.activeFile.id,
	}));

	const tabsArray = useMemo(() => tabs.valueSeq().toArray(), [tabs]);
	const dispatch = useDispatch(dispatchers);

	return (
		<WrappedTabs
			tabs={tabsArray}
			activeTabId={activeTabId}
			dispatch={dispatch}
		/>
	);
};
