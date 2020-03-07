import React from 'react';
import './tabs.scss';
import { useBEM } from '../../utils';

export type TabsProps = {

}

const [tabsBlock, tabsElement] = useBEM('tabs');

export const Tabs: React.FC<TabsProps> = (props) => {
	const {  } = props;

	return (
		<div className={tabsBlock()}>

		</div>
	)
}
