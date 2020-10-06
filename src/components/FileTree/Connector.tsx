import React from 'react';

import { useSelector, useDispatch } from '../../core';
import { ErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';
import { dispatchers } from './dispatcher';

const WrappedFileTree = React.memo(FileTree);

export const FileTreeConnector: React.FC = () => {
	const { files, activeFile } = useSelector((state) => ({
		activeFile: state.activeFile.ref,
		files: state.files,
	}));

	const dispatch = useDispatch(dispatchers);

	return (
		<ErrorBoundary name='FileTree'>
			<WrappedFileTree
				files={files}
				activeFile={activeFile}
				dispatch={dispatch}
			/>
		</ErrorBoundary>
	);
};
