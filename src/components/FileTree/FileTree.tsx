import React, { useState } from 'react';
import './file-tree.scss';
import { Tree, ITreeProps, Button, IButtonProps } from '@blueprintjs/core';
import { ROOT_FOLDER_PATH, isFolderPath, useForceUpdate } from '../../utils';
import { FileTreeDispatch } from './dispatcher';
import { useTree, TreeProps, isFolderNode } from './useTree';
import { fileTreeBlock, NewItemData } from './common';

export type FileTreeProps = Model.FileSystemState & {
	dispatch: FileTreeDispatch;
};

export const FileTree: React.FC<FileTreeProps> = props => {
	const { dispatch, files, activeFilePath } = props;

	const [newItemData, setNewItemData] = useState<NewItemData>(null);
	const { forceUpdate } = useForceUpdate();

	const getCwd = () => {
		if (!activeFilePath) return ROOT_FOLDER_PATH;
		return isFolderPath(activeFilePath)
			? activeFilePath
			: files.get(activeFilePath)!.path.dir;
	};

	const onNodeClick: TreeProps['onNodeClick'] = node => {
		isFolderNode(node)
			? toggleExpanded(node)
			: dispatch.setActiveFile(node.id);
	};

	const toggleExpanded: TreeProps['onNodeExpand'] = node => {
		node.isExpanded = !node.isExpanded;
		dispatch.setActiveFile(node.id);
		forceUpdate();
	};

	const onAddItem = (
		type: NonNullable<NewItemData>['type']
	): IButtonProps['onClick'] => () => {
		setNewItemData({
			type,
			dispatch,
			cwd: getCwd(),
			onDismiss: () => setNewItemData(null),
		});
	};

	const treeProps: TreeProps = {
		contents: useTree(props, newItemData),
		onNodeClick,
		onNodeExpand: toggleExpanded,
		onNodeCollapse: toggleExpanded,
		className: fileTreeBlock({ insert: newItemData }),
	};

	return (
		<div>
			<Button text='New File' onClick={onAddItem('file')} />
			<Button text='New Folder' onClick={onAddItem('folder')} />
			<Tree {...(treeProps as ITreeProps<any>)} />
		</div>
	);
};
