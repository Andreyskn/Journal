import React from 'react';
import './tabs.scss';
import { useBEM } from '../../utils';
import { Button } from '@blueprintjs/core';
import { useStore } from '../../store';

export type TabsProps = {
	tabsList: TabsState['tabsList'];
	activeTabId: TabsState['activeTabId'];
};

const [tabsBlock, tabsElement] = useBEM('tabs');

export const Tabs: React.FC<TabsProps> = ({ activeTabId, tabsList }) => {
	const { dispatch } = useStore();

	const addTab = () => {
		dispatch.tabsAction('@tabs/ADD_TAB');
	};

	return (
		<div className={tabsBlock()}>
			{tabsList.toArray().map(([key, tab]) => (
				<Button
					key={key}
					text={tab.get('contentType') + tab.get('contentId')}
					intent={tab.get('id') === activeTabId ? 'success' : 'none'}
				/>
			))}
			<Button icon='add' onClick={addTab} />
		</div>
	);
};
