import React from 'react';
import { Classes } from '@blueprintjs/core';
import './app.scss';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { Browser } from '../Browser';

const [appBlock] = useBEM('app');

export const App: React.FC = () => {
	return (
		<div className={appBlock(null, Classes.DARK)}>
			<FileTree />
			<Browser />
		</div>
	);
};
