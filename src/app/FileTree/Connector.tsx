import { memo } from 'react';
import { useSelector, useDispatch } from '../../core';
import { ErrorBoundary } from '../../utils';
import { FileTree } from './FileTree';

const WrappedFileTree = memo(FileTree);

export const FileTreeConnector: React.FC = () => {
	const { files, activeFilePath } = useSelector((state) => ({
		activeFilePath: state.activeFile.ref?.path,
		files: state.files,
	}));

	const { dispatch } = useDispatch();

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
