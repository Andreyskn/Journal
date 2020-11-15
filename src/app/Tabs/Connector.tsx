import { useMemo, memo } from 'react';

import { useSelector, useDispatch } from '../../core';
import { Tabs } from './Tabs';
import { ErrorBoundary } from '../../utils';

const WrappedTabs = memo(Tabs);

export const TabsConnector: React.FC = () => {
	const { tabs, activeTabId } = useSelector((state) => ({
		tabs: state.tabs,
		activeTabId: state.activeFile.ref?.id,
	}));

	const tabsArray = useMemo(() => Array.from(tabs.values()), [tabs]);
	const { dispatch } = useDispatch();

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
