import React, { useState, useLayoutEffect } from 'react';
import './file-tree.scss';
import {
	Tree,
	ITreeProps,
	Button,
	IButtonProps,
	ButtonGroup,
	ContextMenu,
	Menu,
	MenuItem,
} from '@blueprintjs/core';
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
	Node,
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

	const onNodeClick: TreeProps['onNodeClick'] = (node) => {
		if (isFolderNode(node)) {
			onToggleExpanded(node);
		} else selectNode(node);
	};

	const selectNode = (node: Node) => {
		if (node.id !== selected.path) {
			setSelected({ path: node.id });

			if (!isFolderNode(node)) {
				dispatch.setActiveFile(node.id);
			}
		}
	};

	const onNodeContextMenu: TreeProps['onNodeContextMenu'] = (node, _, e) => {
		e.preventDefault();
		selectNode(node);

		const onDelete = () => {
			if (!isFolderNode(node)) {
				dispatch.deleteFile(node.id);
			}
		};

		ContextMenu.show(
			<Menu>
				<MenuItem text='Rename' />
				<MenuItem text='Delete' onClick={onDelete} />
			</Menu>,
			{ left: e.pageX, top: e.pageY },
			undefined,
			true
		);
	};

	const onToggleExpanded: TreeProps['onNodeExpand'] = (node) => {
		node.isExpanded = !node.isExpanded;
		selectNode(node);
	};

	const onAddItem = (
		type: NewItemProps['type']
	): IButtonProps['onClick'] => () => {
		const cwd = getCwd();
		const onDismiss = () => setNewItemData(null);
		const onCreate: NewItemProps['onCreate'] = (name) => {
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
		nodesMap.folders.forEach((node) => {
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
		onNodeContextMenu: onNodeContextMenu,
		onNodeExpand: onToggleExpanded,
		onNodeCollapse: onToggleExpanded,
		className: fileTreeBlock({ insert: newItemData }),
	};

	return (
		<div className={explorerBlock()}>
			<div className={explorerElement('controls')}>
				<ButtonGroup>
					<Button
						icon='document'
						title='New File'
						onClick={onAddItem('file')}
					/>
					<Button
						icon='folder-new'
						title='New Folder'
						onClick={onAddItem('folder')}
					/>
				</ButtonGroup>
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
