import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';

import { Tabs } from './Tabs';
import { createDispatch } from './dispatcher';
import { withErrorBoundary, isFolderPath } from '../../utils';

const WrappedTabs = React.memo(withErrorBoundary(Tabs));

export const TabsConnector: React.FC = () => {
	const store = useStore<Model.ImmutableAppState, Model.AppAction>();

	const { tabs, files, activeFilePath } = useSelector<
		Model.ImmutableAppState,
		Model.TabsState &
			Pick<Model.FileSystemState, 'activeFilePath' | 'files'>
	>(state => ({
		tabs: state.tabs,
		activeFilePath: state.activeFilePath,
		files: state.files,
	}));

	const tabsArray = useMemo(() => tabs.toArray(), [tabs]);
	const tabsDispatch = useMemo(() => createDispatch({ store }), [store]);

	const [activeFile, setActiveFile] = useState<Model.ImmutableFile>(
		files.get(activeFilePath!)!
	);

	const getActiveDocument = () => {
		if (!activeFilePath) return null;
		if (isFolderPath(activeFilePath)) return activeFile;
		return files.get(activeFilePath)!;
	};

	useEffect(() => {
		const active = getActiveDocument();
		active && setActiveFile(active);
	}, [activeFilePath]);

	return (
		<WrappedTabs
			tabs={tabsArray}
			files={files}
			activeFile={activeFile}
			dispatch={tabsDispatch}
		/>
	);
};
