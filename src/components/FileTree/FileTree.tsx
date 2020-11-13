import { useState, useEffect } from 'react';
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
	MenuDivider,
} from '@blueprintjs/core';
import { useForceUpdate, bem } from '../../utils';
import {
	useTree,
	TreeProps,
	isFolderNode,
	expandParentFolders,
	Node,
	isEditingNode,
} from './useTree';
import { classes as fileTreeClasses, NodeEditorData } from './common';
import { NodeEditorProps } from './NodeEditor';
import { DIRECTORY_ID, fs, PATHS } from '../../core/fileSystem';
import { useAppContext } from '../context';

const explorerClasses = bem('file-explorer', [
	'move-target',
	'controls',
	'tree-container',
	'filler',
] as const);

export type FileTreeProps = {
	files: App.FileSystemState['files'];
	activeFilePath: App.ActiveFilePath;
	dispatch: App.CoreDispatch;
};

export const FileTree: React.FC<FileTreeProps> = ({
	dispatch,
	files,
	activeFilePath,
}) => {
	const { showAlert } = useAppContext();

	const [selection, setSelection] = useState<{ path: Maybe<string> }>({
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
			const selectedNode =
				activeFilePath && nodesMap.files.get(activeFilePath);
			selectedNode && expandParentFolders(selectedNode);
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
		const path = node.nodeData.path;

		if (path !== selection.path) {
			setSelection({ path });

			if (!isFolderNode(node) && path !== activeFilePath) {
				dispatch.fs.setActiveFile({ id: node.id });
			}
		}
	};

	// TODO: move to separate module
	const onNodeContextMenu: TreeProps['onNodeContextMenu'] = (node, _, e) => {
		if (isEditingNode(node)) return;
		e.preventDefault();

		const onRename = () => {
			const cwd = getCurrentDirectory();
			const onDismiss = () => setNodeEditorData(null);
			const onCreate: NodeEditorProps['onConfirm'] = (name) => {
				dispatch.fs.renameFile({ id: node.id, name });
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

		const onDelete = () => dispatch.fs.moveToTrash({ id: node.id });

		const onMove = (target: App.Directory['id']) => () => {
			new Promise<boolean>((resolve) => {
				const targetData = (files.get(target) as App.Directory).data;
				const hasNameCollision = targetData.has(node.label as string);

				if (!hasNameCollision) return resolve(true);

				showAlert({
					icon: 'warning-sign',
					confirmButtonText: 'Replace',
					cancelButtonText: 'Cancel',
					intent: 'warning',
					content: (
						<p>
							A {node.nodeData.type} with the name{' '}
							<b>{node.label}</b> already exists in the
							destination folder. Do you want to replace it?
						</p>
					),
					onConfirm: () => resolve(true),
					onCancel: () => resolve(false),
				});
			}).then(
				(confirm) =>
					confirm &&
					dispatch.fs.moveFile({ id: node.id, newParent: target })
			);
		};

		const moveTargets = [...nodesMap.folders.values()]
			.filter((folderNode) => {
				const isSelf = folderNode === node;
				const isParent = folderNode.id === node.nodeData.parent!.id;
				const isDescendant = folderNode.nodeData.path.startsWith(
					node.nodeData.path
				);
				return !isSelf && !isParent && !isDescendant;
			})
			.sort((a, b) => a.nodeData.path.localeCompare(b.nodeData.path))
			.map((folderNode) => {
				const label = folderNode.label || 'Root';
				const path = fs.getMainRelativePath(folderNode.nodeData.path);
				return { label, path, id: folderNode.id };
			});

		ContextMenu.show(
			<Menu>
				<MenuItem text='Move to folder' disabled={!moveTargets.length}>
					{moveTargets.map(({ label, path, id }) => (
						<MenuItem
							key={id}
							text={
								<div
									className={explorerClasses.moveTargetElement()}
								>
									{label} <span>{path}</span>
								</div>
							}
							onClick={onMove(id)}
						/>
					))}
				</MenuItem>
				<MenuDivider />
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
		nodeType: NodeEditorProps['type']
	): IButtonProps['onClick'] => () => {
		const cwd = getCurrentDirectory();
		const onDismiss = () => setNodeEditorData(null);
		const onConfirm: NodeEditorProps['onConfirm'] = (name, fileType) => {
			if ((nodeType as NodeEditorProps['type']) === 'folder') {
				setSelection({ path: fs.getFilePath(files, name, cwd) });
			}
			dispatch.fs.createFile({ name, parent: cwd, type: fileType });
			onDismiss();
		};
		setNodeEditorData({
			mode: 'create',
			type: nodeType,
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
		className: fileTreeClasses.fileTreeBlock({ insert: nodeEditorData }),
	};

	return (
		<div className={explorerClasses.fileExplorerBlock()}>
			<div className={explorerClasses.controlsElement()}>
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
				className={explorerClasses.treeContainerElement({
					selected: !nodeEditorData && selection.path === PATHS.main,
				})}
			>
				<Tree {...(treeProps as ITreeProps<any>)} />
				<div
					className={explorerClasses.fillerElement()}
					onClick={onRootSelect}
				/>
			</div>
		</div>
	);
};
