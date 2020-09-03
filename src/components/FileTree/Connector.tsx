import React from 'react';
import { useSelector, useDispatch } from '../../core/store';

import { withErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';
import { dispatchers } from './dispatcher';

const WrappedFileTree = React.memo(withErrorBoundary(FileTree));

export const FileTreeConnector: React.FC = () => {
	const { files, activeFilePath } = useSelector((state) => ({
		activeFilePath: state.activeFile.path,
		files: state.files,
	}));

	const fileTreeDispatch = useDispatch(dispatchers);

	return (
		<WrappedFileTree
			files={files}
			activeFilePath={activeFilePath}
			dispatch={fileTreeDispatch}
		/>
	);
};
