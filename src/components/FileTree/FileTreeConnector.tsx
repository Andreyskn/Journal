import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { withErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';
import { createDispatch } from './FileTreeDispatcher';

const WrappedFileTree = React.memo(withErrorBoundary(FileTree));

export const FileTreeConnector: React.FC = () => {
	const dispatch = useDispatch();

	const { activeFilePath, files, folders, cwd } = useSelector<
		Model.ImmutableAppState,
		Model.FileSystemState
	>(state => ({
		activeFilePath: state.activeFilePath,
		files: state.files,
		folders: state.folders,
		cwd: state.cwd,
	}));

	const fileTreeDispatch = useMemo(() => createDispatch({ dispatch }), [
		dispatch,
	]);

	return (
		<WrappedFileTree
			files={files}
			activeFilePath={activeFilePath}
			folders={folders}
			cwd={cwd}
			dispatch={fileTreeDispatch}
		/>
	);
};
