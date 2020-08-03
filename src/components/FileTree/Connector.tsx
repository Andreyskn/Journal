import React, { useMemo } from 'react';
import { useSelector, useStore } from 'react-redux';

import { withErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';
import { createDispatch } from './dispatcher';

const WrappedFileTree = React.memo(withErrorBoundary(FileTree));

export const FileTreeConnector: React.FC = () => {
	const store = useStore<Store.ImmutableAppState, Actions.AppAction>();

	const { activeFilePath, files, folders } = useSelector<
		Store.ImmutableAppState,
		Store.FileSystemState
	>(state => ({
		activeFilePath: state.activeFilePath,
		files: state.files,
		folders: state.folders,
	}));

	const fileTreeDispatch = useMemo(() => createDispatch({ store }), [store]);

	return (
		<WrappedFileTree
			files={files}
			activeFilePath={activeFilePath}
			folders={folders}
			dispatch={fileTreeDispatch}
		/>
	);
};
