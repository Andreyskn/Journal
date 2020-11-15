import { hot } from 'react-hot-loader/root';

import './main.scss';

import { Classes } from '@blueprintjs/core';
import { bem } from '../../utils';
import { FileTree } from '../FileTree';
import { Tabs } from '../Tabs';
import { Viewer } from '../Viewer';
import { useAppContextProvider } from '../context';
import { Taskbar } from '../Taskbar';
import { WindowManager } from '../Windows/WIndowManager';

const classes = bem('app', ['file-tree', 'tabs', 'viewer', 'taskbar'] as const);

export const Main: React.FC = hot(() => {
	const { AppContextProvider } = useAppContextProvider();

	return (
		<AppContextProvider>
			<div className={classes.appBlock(null, Classes.DARK)}>
				<div className={classes.fileTreeElement()}>
					<FileTree />
				</div>
				<div className={classes.tabsElement()}>
					<Tabs />
				</div>
				<div className={classes.viewerElement()}>
					<Viewer />
				</div>
				<div className={classes.taskbarElement()}>
					<Taskbar />
				</div>
			</div>
			<WindowManager />
		</AppContextProvider>
	);
});
