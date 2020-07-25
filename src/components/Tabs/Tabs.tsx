import React from 'react';
import './tabs.scss';
import { useBEM } from '../../utils';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';

const [tabsBlock, tabsElement] = useBEM('tabs');

type AddTab = ActionBase<'ADD_TAB', Tab['contentType']>;
type SetActive = ActionBase<'SET_ACTIVE', Tab['id']>;

type TabsAction = AddTab | SetActive;

export type TabsProps = TabsState & {
	onAction: (action: TabsAction) => void;
};

export const Tabs: React.FC<TabsProps> = React.memo(
	({ activeTabId, tabsList, onAction }) => {
		const addTab = (contentType: Tab['contentType']) => () => {
			onAction({ type: 'ADD_TAB', payload: contentType });
		};

		const setActiveTab = (id: Tab['id']) => () => {
			if (activeTabId === id) return;
			onAction({ type: 'SET_ACTIVE', payload: id });
		};

		const createTabMenu = (
			<Menu>
				<MenuItem
					icon='tick'
					text='New Task List'
					onClick={addTab('tasks')}
				/>
			</Menu>
		);

		return (
			<div className={tabsBlock()}>
				{tabsList.toArray().map(([key, tab]) => (
					<Button
						key={key}
						text={tab.get('id')}
						intent={tab.id === activeTabId ? 'success' : 'none'}
						onClick={setActiveTab(tab.id)}
					/>
				))}
				<Popover content={createTabMenu} position='bottom-left' minimal>
					<Button icon='add' />
				</Popover>
			</div>
		);
	}
);
