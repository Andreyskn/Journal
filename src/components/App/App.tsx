import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Classes } from '@blueprintjs/core';
import './app.scss';
import { useBEM } from '../../utils';
import { FileTree } from '../FileTree';
import { Browser } from '../Browser';
import { useSelector } from 'react-redux';

const [appBlock] = useBEM('app');

export const App: React.FC = hot(() => {
	const state = useSelector<ImmutableAppState, ImmutableAppState>(
		state => state
	);

	useEffect(() => {
		(window as any).saveState = () =>
			localStorage.setItem('state', JSON.stringify(state));
	}, [state]);

	return (
		<div className={appBlock(null, Classes.DARK)}>
			<FileTree />
			<Browser />
		</div>
	);
});
