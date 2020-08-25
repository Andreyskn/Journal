import React, { useMemo } from 'react';
import { useSelector, useStore } from 'react-redux';

import { withErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';
import { createDispatch } from './dispatcher';

const WrappedFileTree = React.memo(withErrorBoundary(FileTree));

export const FileTreeConnector: React.FC = () => {
	const store = useStore<App.ImmutableAppState, Actions.AppAction>();

	const { files, activeFilePath } = useSelector<
		App.ImmutableAppState,
		{
			files: App.FileSystemState['files'];
			activeFilePath: App.FileSystemState['activeFile']['path'];
		}
	>((state) => ({
		activeFilePath: state.activeFile.path,
		files: state.files,
	}));

	const fileTreeDispatch = useMemo(() => createDispatch({ store }), [store]);

	return (
		<WrappedFileTree
			files={files}
			activeFilePath={activeFilePath}
			dispatch={fileTreeDispatch}
		/>
	);
};
