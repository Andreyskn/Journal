import React, { useState, useLayoutEffect } from 'react';
import './file-tree.scss';
import { Tree, ITreeProps, Button, IButtonProps } from '@blueprintjs/core';
import {
	ROOT_FOLDER_PATH,
	isFolderPath,
	getFolderPath,
	useForceUpdate,
	useBEM,
} from '../../utils';
import { FileTreeDispatch } from './dispatcher';
import {
	useTree,
	TreeProps,
	isFolderNode,
	expandParentFolders,
} from './useTree';
import { fileTreeBlock, NewItemData } from './common';
import { NewItemProps } from './NewItem';

const [explorerBlock, explorerElement] = useBEM('file-explorer');

export type FileTreeProps = Store.FileSystemState & {
	dispatch: FileTreeDispatch;
};

export const FileTree: React.FC<FileTreeProps> = ({
	dispatch,
	files,
	folders,
	activeFilePath,
}) => {
	const [selected, setSelected] = useState<{ path: string | null }>({
		path: activeFilePath,
	});
	const [newItemData, setNewItemData] = useState<NewItemData>(null);

	const { contents, nodesMap } = useTree(
		folders,
		files,
		newItemData,
		selected.path
	);
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
		type: NewItemProps['type']
	): IButtonProps['onClick'] => () => {
		const cwd = getCwd();
		const onDismiss = () => setNewItemData(null);
		const onCreate: NewItemProps['onCreate'] = name => {
			if (type === 'folder') {
				setSelected({ path: getFolderPath(cwd, name) });
			}
			onDismiss();
		};

		setNewItemData({
			type,
			dispatch,
			cwd,
			folders,
			onCreate,
			onDismiss,
		});
	};

	const onCollapseAll = () => {
		nodesMap.folders.forEach(node => {
			node.isExpanded = false;
		});
		forceUpdate();
	};

	const onRootSelect = () => {
		setSelected({ path: ROOT_FOLDER_PATH });
		// TODO: handle click outside
	};

	const treeProps: TreeProps = {
		contents,
		onNodeClick,
		onNodeExpand: onToggleExpanded,
		onNodeCollapse: onToggleExpanded,
		className: fileTreeBlock({ insert: newItemData }),
	};

	return (
		<div className={explorerBlock()}>
			<div className={explorerElement('controls')}>
				<Button
					minimal
					icon='document'
					title='New File'
					onClick={onAddItem('file')}
				/>
				<Button
					minimal
					icon='folder-new'
					title='New Folder'
					onClick={onAddItem('folder')}
				/>
				<Button
					minimal
					icon='collapse-all'
					title='Collapse Folders'
					onClick={onCollapseAll}
				/>
			</div>
			<div
				className={explorerElement('tree-container', {
					selected:
						!newItemData && selected.path === ROOT_FOLDER_PATH,
				})}
			>
				<Tree {...(treeProps as ITreeProps<any>)} />
				<div
					className={explorerElement('filler')}
					onClick={onRootSelect}
				/>
			</div>
		</div>
	);
};
