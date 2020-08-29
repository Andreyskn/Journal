import React, { useState, useEffect } from 'react';
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
import { useForceUpdate, useBEM } from '../../utils';
import { FileTreeDispatch } from './dispatcher';
import {
	useTree,
	TreeProps,
	isFolderNode,
	expandParentFolders,
	Node,
	isEditingNode,
} from './useTree';
import { fileTreeBlock, NodeEditorData } from './common';
import { NodeEditorProps } from './NodeEditor';
import { DIRECTORY_ID, getFilePath, PATHS } from '../../core/fileSystem';

const [explorerBlock, explorerElement] = useBEM('file-explorer');

export type FileTreeProps = {
	files: App.FileSystemState['files'];
	activeFilePath: App.FileSystemState['activeFile']['path'];
	dispatch: FileTreeDispatch;
};

export const FileTree: React.FC<FileTreeProps> = ({
	dispatch,
	files,
	activeFilePath,
}) => {
	const [selection, setSelection] = useState<{ path: string | null }>({
		path: activeFilePath,
	});
	const [nodeEditorData, setNodeEditorData] = useState<NodeEditorData>(null);

	const { contents, nodesMap } = useTree(
		files,
		nodeEditorData,
		selection.path
	);
	const { forceUpdate } = useForceUpdate();

	useEffect(() => {
		if (selection.path !== activeFilePath) {
			setSelection({ path: activeFilePath });
			const newSelectedNode =
				activeFilePath && nodesMap.files.get(activeFilePath);
			newSelectedNode && expandParentFolders(newSelectedNode);
		}
	}, [activeFilePath]);

	const getCurrentDirectory = () => {
		if (!selection.path) return DIRECTORY_ID.main;

		const selectedNode = (nodesMap.folders.get(selection.path) ||
			nodesMap.files.get(selection.path)) as Node;
		const selectedFile = files.get(selectedNode.id)!;

		return selectedFile.type === 'directory'
			? selectedFile.id
			: (selectedFile as App.RegularFile).parent;
	};

	const onNodeClick: TreeProps['onNodeClick'] = (node) => {
		if (isFolderNode(node)) {
			onToggleExpanded(node);
		} else selectNode(node);
	};

	const selectNode = (node: Node) => {
		if (node.nodeData.path !== selection.path) {
			setSelection({ path: node.nodeData.path });

			if (!isFolderNode(node)) {
				dispatch.setActiveFile(node.id);
			}
		}
	};

	const onNodeContextMenu: TreeProps['onNodeContextMenu'] = (node, _, e) => {
		if (isEditingNode(node)) return;
		e.preventDefault();
		selectNode(node);

		const onRename = () => {
			const cwd = getCurrentDirectory();
			const onDismiss = () => setNodeEditorData(null);
			const onCreate: NodeEditorProps['onConfirm'] = (name) => {
				dispatch.renameFile(node.id, name);
				onDismiss();
			};
			setNodeEditorData({
				mode: 'rename',
				id: node.id,
				type: node.nodeData.type,
				cwd,
				onConfirm: onCreate,
				onDismiss,
				files,
			});
		};

		const onDelete = () => dispatch.deleteFile(node.id);

		ContextMenu.show(
			<Menu>
				<MenuItem text='Rename' onClick={onRename} />
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
		forceUpdate();
	};

	const onAddItem = (
		type: NodeEditorProps['type']
	): IButtonProps['onClick'] => () => {
		const cwd = getCurrentDirectory();
		const onDismiss = () => setNodeEditorData(null);
		const onConfirm: NodeEditorProps['onConfirm'] = (name) => {
			if (type === 'folder') {
				setSelection({ path: getFilePath(files, name, cwd) });
			}
			dispatch.createFile(name, cwd);
			onDismiss();
		};
		setNodeEditorData({
			mode: 'create',
			type,
			cwd,
			onConfirm,
			onDismiss,
			files,
		});
	};

	const onCollapseAll = () => {
		nodesMap.folders.forEach((node) => {
			node.isExpanded = false;
		});
		forceUpdate();
	};

	const onRootSelect = () => {
		setSelection({ path: PATHS.main });
		// TODO: handle click outside
	};

	const treeProps: TreeProps = {
		contents,
		onNodeClick,
		onNodeContextMenu: onNodeContextMenu,
		onNodeExpand: onToggleExpanded,
		onNodeCollapse: onToggleExpanded,
		className: fileTreeBlock({ insert: nodeEditorData }),
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
					selected: !nodeEditorData && selection.path === PATHS.main,
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
