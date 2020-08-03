import React, { useState, useLayoutEffect } from 'react';
import './file-tree.scss';
import { Tree, ITreeProps, Button, IButtonProps } from '@blueprintjs/core';
import {
	ROOT_FOLDER_PATH,
	isFolderPath,
	getFolderPath,
	useForceUpdate,
} from '../../utils';
import { FileTreeDispatch } from './dispatcher';
import {
	useTree,
	TreeProps,
	isFolderNode,
	expandParentFolders,
} from './useTree';
import { fileTreeBlock, NewItemData } from './common';

export type FileTreeProps = Store.FileSystemState & {
	dispatch: FileTreeDispatch;
};

export const FileTree: React.FC<FileTreeProps> = props => {
	const { dispatch, files, activeFilePath } = props;

	const [selected, setSelected] = useState<{ path: string | null }>({
		path: null,
	});
	const [newItemData, setNewItemData] = useState<NewItemData>(null);

	const { contents, nodesMap } = useTree(props, newItemData, selected.path);
	const { forceUpdate } = useForceUpdate();

	useLayoutEffect(() => {
		if (selected.path !== activeFilePath) {
			setSelected({ path: activeFilePath });
			const newSelectedNode =
				activeFilePath && nodesMap.files.get(activeFilePath);
			newSelectedNode && expandParentFolders(newSelectedNode);
		}
	}, [activeFilePath]);

	const getCwd = () => {
		if (!selected.path) return ROOT_FOLDER_PATH;
		return isFolderPath(selected.path)
			? selected.path
			: files.get(selected.path)!.path.dir;
	};

	const onNodeClick: TreeProps['onNodeClick'] = node => {
		if (isFolderNode(node)) return onToggleExpanded(node);

		if (node.id !== selected.path) {
			dispatch.setActiveFile(node.id);
			setSelected({ path: node.id });
		}
	};

	const onToggleExpanded: TreeProps['onNodeExpand'] = node => {
		node.isExpanded = !node.isExpanded;
		setSelected({ path: node.id });
	};

	const onAddItem = (
		type: NonNullable<NewItemData>['type']
	): IButtonProps['onClick'] => () => {
		const cwd = getCwd();

		setNewItemData({
			type,
			dispatch,
			cwd,
			onCreate: name =>
				type === 'folder' &&
				setSelected({ path: getFolderPath(cwd, name) }),
			onDismiss: () => setNewItemData(null),
		});
	};

	const onCollapseAll = () => {
		nodesMap.folders.forEach(node => {
			node.isExpanded = false;
		});
		forceUpdate();
	};

	const treeProps: TreeProps = {
		contents,
		onNodeClick,
		onNodeExpand: onToggleExpanded,
		onNodeCollapse: onToggleExpanded,
		className: fileTreeBlock({ insert: newItemData }),
	};

	return (
		<div>
			<Button text='New File' onClick={onAddItem('file')} />
			<Button text='New Folder' onClick={onAddItem('folder')} />
			<Button text='Collapse Folders' onClick={onCollapseAll} />
			<Tree {...(treeProps as ITreeProps<any>)} />
		</div>
	);
};
