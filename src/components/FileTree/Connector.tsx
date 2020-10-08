import React from 'react';

import { useSelector, useEnhancedDispatch } from '../../core';
import { ErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';

const WrappedFileTree = React.memo(FileTree);

export const FileTreeConnector: React.FC = () => {
	const { files, activeFilePath } = useSelector((state) => ({
		activeFilePath: state.activeFile.ref?.path,
		files: state.files,
	}));

	const dispatch = useEnhancedDispatch();

	return (
		<ErrorBoundary name='FileTree'>
			<WrappedFileTree
				files={files}
				activeFilePath={activeFilePath}
				dispatch={dispatch}
			/>
		</ErrorBoundary>
	);
};
