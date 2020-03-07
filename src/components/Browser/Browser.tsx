import React from 'react';
import './browser.scss';
import { useBEM } from '../../utils';
import { TaskList } from '../TaskList';

export type BrowserProps = {};

const [browserBlock, browserElement] = useBEM('browser');

export const Browser: React.FC<BrowserProps> = props => {
	const {} = props;

	return (
		<div className={browserBlock()}>
			<TaskList />
		</div>
	);
};
