import React from 'react';
import './file-tree.scss';
import { Tree, ITreeProps } from '@blueprintjs/core';
import { useBEM } from '../../utils';

export type FileTreeProps = {};

const [fileTreeBlock, fileTreeElement] = useBEM('file-tree');

export const FileTree: React.FC<FileTreeProps> = props => {
	const {} = props;

	const treeProps: ITreeProps = {
		contents: [
			{
				id: 1,
				label: 'Label',
				hasCaret: true,
				icon: 'folder-close',
			},
			{
				id: 2,
				label: 'Label 2',
				hasCaret: true,
				icon: 'folder-open',
				isExpanded: true,
			},
		],
	};

	return (
		<div className={fileTreeBlock()}>
			<Tree {...treeProps} />
		</div>
	);
};
