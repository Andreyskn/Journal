import React from 'react';
import './browser.scss';
import { useBEM } from '../../utils';
import { TaskList } from '../TaskList';
import { Tabs } from '../Tabs';

export type BrowserProps = {};

const [browserBlock, browserElement] = useBEM('browser');

export const Browser: React.FC<BrowserProps> = () => {
	return (
		<div className={browserBlock()}>
			<Tabs />
			<TaskList />
		</div>
	);
};
