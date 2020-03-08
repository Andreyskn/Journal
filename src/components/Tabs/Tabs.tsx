import React from 'react';
import './tabs.scss';
import { useBEM } from '../../utils';
import { Button } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { action } from '../../store';

export type TabsProps = {
	tabs: TabsState['tabs'];
	activeTabId: TabsState['activeTabId'];
};

const [tabsBlock, tabsElement] = useBEM('tabs');

export const Tabs: React.FC<TabsProps> = ({ activeTabId, tabs }) => {
	const dispatch = useDispatch<TabDispatch>();

	const addTab = () => {
		dispatch(action('@tabs/ADD_TAB'));
	};

	return (
		<div className={tabsBlock()}>
			{tabs.toArray().map(([key, tab]) => (
				<Button
					key={key}
					text={tab.get('contentType') + tab.get('contentId')}
				/>
			))}
			<Button icon='add' onClick={addTab} />
		</div>
	);
};
