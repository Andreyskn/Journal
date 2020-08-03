import React, { useRef } from 'react';
import { ITreeProps, ITreeNode } from '@blueprintjs/core';
import { fileIcons, ROOT_FOLDER_PATH } from '../../utils';
import { FileTreeProps } from './FileTree';
import { NewItemProps, NewItem } from './NewItem';
import { fileTreeElement, NewItemData } from './common';

export type TreeProps = OmitType<
	ITreeProps<any>,
	'onNodeClick' | 'onNodeCollapse' | 'onNodeExpand' | 'contents'
> & {
	contents: TreeNode[];
	onNodeClick: (node: Node) => void;
	onNodeCollapse: (node: FolderNode) => void;
	onNodeExpand: (node: FolderNode) => void;
};

type LeafNode<T> = OmitType<
	ITreeNode,
	'childNodes' | 'nodeData' | 'isExpanded' | 'id'
> & {
	nodeData: T;
	id: string;
};
type InnerNode<T> = LeafNode<T> & {
	childNodes: (LeafNode<NodeData> | InnerNode<NodeData>)[];
	isExpanded: boolean;
};
type TreeNode = LeafNode<NodeData> | InnerNode<NodeData>;

type FolderNodeData = { type: 'folder'; parent: FolderNode | null };
type FileNodeData = { type: 'file'; parent: FolderNode };
type NodeData = FolderNodeData | FileNodeData;

type FolderNode = InnerNode<FolderNodeData>;
type FileNode = LeafNode<FileNodeData>;
type Node = FolderNode | FileNode;

type NodesMap = {
	folders: Map<Path, FolderNode>;
	files: Map<Path, FileNode>;
};

const getNodeClass = (isNew: boolean) => {
	return fileTreeElement('node', { new: isNew });
};

const createFolderNode = ({
	label = '',
	id = '',
	isExpanded = false,
	isSelected = false,
	isNew = false,
	parent,
}: Partial<
	Pick<FolderNode, 'label' | 'id' | 'isExpanded' | 'isSelected' | 'className'>
> & { isNew?: boolean; parent: FolderNode | null }): FolderNode => ({
	id,
	label,
	isExpanded,
	isSelected,
	childNodes: [],
	nodeData: { type: 'folder', parent },
	icon: isExpanded ? 'folder-open' : 'folder-close',
	hasCaret: !isNew,
	className: getNodeClass(isNew),
});

const createFileNode = ({
	label = '',
	id = '',
	isSelected = false,
	type,
	parent,
	isNew = false,
}: Partial<
	Pick<FileNode, 'id' | 'label' | 'isSelected' | 'className'> &
		Pick<Store.File, 'type'>
> & { isNew?: boolean; parent: FolderNode }): FileNode => ({
	id,
	label,
	isSelected,
	nodeData: { type: 'file', parent },
	icon: type ? fileIcons[type] : 'document',
	className: getNodeClass(isNew),
});

export const expandParentFolders = ({ nodeData: { parent } }: Node) => {
	while (parent) {
		parent.isExpanded = true;
		parent = parent.nodeData.parent;
	}
};

const maybeAppendNewItem = (
	type: NewItemProps['type'],
	folder: FolderNode,
	newItem: NewItemData
) => {
	if (!newItem || folder.id !== newItem.cwd || type !== newItem.type) return;

	const createNode = type === 'folder' ? createFolderNode : createFileNode;
	const newItemNode = createNode({
		label: <NewItem {...newItem} />,
		isNew: true,
		parent: folder,
	});

	folder.childNodes.push(newItemNode);
	expandParentFolders(newItemNode);
};

export const isFolderNode = (node: Node): node is FolderNode => {
	return node.nodeData.type === 'folder';
};

export const useTree = (
	{ folders, files }: FileTreeProps,
	newItem: NewItemData,
	selectedPath: string | null
) => {
	const prevNodesMap = useRef<NodesMap | undefined>();
	const rootFolder = folders.first(null)!;
	const rootNode = createFolderNode({ id: ROOT_FOLDER_PATH, parent: null });
	const nodesMap: NodesMap = {
		folders: new Map([[rootFolder.path, rootNode]]),
		files: new Map(),
	};

	const isSelected = (path: string) => !newItem && path === selectedPath;

	folders.forEach(folder => {
		const folderNode = nodesMap.folders.get(folder.path)!;

		maybeAppendNewItem('folder', folderNode, newItem);

		folder.content.folders.forEach(path => {
			const childFolder = folders.get(path)!;

			const childFolderNode = createFolderNode({
				id: path,
				label: childFolder.name,
				isExpanded: prevNodesMap.current?.folders.get(path)?.isExpanded,
				isSelected: isSelected(path),
				parent: folderNode,
			});

			nodesMap.folders.set(path, childFolderNode);
			folderNode.childNodes.push(childFolderNode);
		});

		maybeAppendNewItem('file', folderNode, newItem);

		folder.content.files.forEach(path => {
			const file = files.get(path)!;

			const fileNode = createFileNode({
				id: path,
				label: file.path.base,
				isSelected: isSelected(path),
				type: file.type,
				parent: folderNode,
			});

			nodesMap.files.set(path, fileNode);
			folderNode.childNodes.push(fileNode);
		});
	});

	prevNodesMap.current = nodesMap;

	return { contents: rootNode.childNodes, nodesMap };
};
