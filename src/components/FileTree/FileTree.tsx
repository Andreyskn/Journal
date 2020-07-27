import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './file-tree.scss';
import { Tree, ITreeProps } from '@blueprintjs/core';
import { useBEM, fileIcons } from '../../utils';

const [fileTreeBlock, fileTreeElement] = useBEM('file-tree');

export const FileTree: React.FC = () => {
	const { activeFilePath, files, folders } = useSelector<
		Model.ImmutableAppState,
		Model.FileSystemState
	>(state => ({
		activeFilePath: state.activeFilePath,
		files: state.files,
		folders: state.folders,
	}));

	const filesArray = useMemo(() => files.toArray(), [files]);

	const treeProps: ITreeProps = {
		contents: filesArray.map(([id, file]) => ({
			id,
			label: file.path.base,
			icon: fileIcons[file.type],
			isSelected: file.path.absolute === activeFilePath,
		})),
	};

	// treeProps.contents.push(
	// 	{
	// 		id: 1,
	// 		label: 'Label',
	// 		hasCaret: true,
	// 		icon: 'folder-close',
	// 	},
	// 	{
	// 		id: 2,
	// 		label: 'Label 2',
	// 		hasCaret: true,
	// 		icon: 'folder-open',
	// 		isExpanded: true,
	// 	}
	// );

	return (
		<div className={fileTreeBlock()}>
			<Tree {...treeProps} />
		</div>
	);
};
