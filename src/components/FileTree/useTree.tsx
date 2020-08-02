import React, { useRef } from 'react';
import { ITreeProps, ITreeNode } from '@blueprintjs/core';
import { fileIcons } from '../../utils';
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

type FolderNodeData = { parent: FolderNode | null };
type FileNodeData = undefined;
type NodeData = FolderNodeData | FileNodeData;

type FolderNode = InnerNode<FolderNodeData>;
type FileNode = LeafNode<FileNodeData>;
type Node = FolderNode | FileNode;

type FolderNodesMap = Map<Model.Folder['path'], FolderNode>;

const getNodeClass = (isNew: boolean) =>
	fileTreeElement('node', { new: isNew });

const createFolderNode = ({
	label = '',
	id = '',
	isExpanded = false,
	isSelected = false,
	isNew = false,
	parent,
}: Partial<
	Pick<FolderNode, 'label' | 'id' | 'isExpanded' | 'isSelected' | 'className'>
> & { isNew?: boolean; parent: FolderNode }): FolderNode => ({
	id,
	label,
	isExpanded,
	isSelected,
	childNodes: [],
	nodeData: { parent },
	icon: isExpanded ? 'folder-open' : 'folder-close',
	className: getNodeClass(isNew),
});

const createFileNode = ({
	label = '',
	id = '',
	isSelected = false,
	type,
	isNew = false,
}: Partial<
	Pick<FileNode, 'id' | 'label' | 'isSelected' | 'className'> &
		Pick<Model.File, 'type'>
> & { isNew?: boolean }): FileNode => ({
	id,
	label,
	isSelected,
	nodeData: undefined, // TODO: remove property
	icon: type ? fileIcons[type] : 'document',
	className: getNodeClass(isNew),
});

const expandParentFolders = (parent: FolderNode | null) => {
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
	folder.childNodes.push(
		createNode({
			label: <NewItem {...newItem} />,
			isNew: true,
			parent: folder,
		})
	);
	expandParentFolders(folder);
};

export const isFolderNode = (node: Node): node is FolderNode => {
	return Boolean(node.nodeData);
};

export const useTree = (
	{ folders, files, activeFilePath }: FileTreeProps,
	newItem: NewItemData
) => {
	const prevFolderNodeMap = useRef<FolderNodesMap | undefined>();
	const rootFolder = folders.first(null)!;
	const rootNode: FolderNode = {
		id: rootFolder.path,
		label: '',
		childNodes: [],
		isExpanded: true,
		nodeData: { parent: null },
	};
	const folderNodesMap: FolderNodesMap = new Map([
		[rootFolder.path, rootNode],
	]);

	const isSelected = (path: string) => !newItem && path === activeFilePath;

	folders.forEach(folder => {
		const folderNode = folderNodesMap.get(folder.path)!;

		maybeAppendNewItem('folder', folderNode, newItem);

		folder.content.folders.forEach(path => {
			const childFolder = folders.get(path)!;

			const childFolderNode = createFolderNode({
				id: path,
				label: childFolder.name,
				isExpanded: prevFolderNodeMap.current?.get(path)?.isExpanded,
				isSelected: isSelected(path),
				parent: folderNode,
			});

			folderNodesMap.set(path, childFolderNode);
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
			});

			if (fileNode.isSelected) {
				expandParentFolders(folderNode);
			}
			folderNode.childNodes.push(fileNode);
		});
	});

	prevFolderNodeMap.current = folderNodesMap;
	return rootNode.childNodes;
};
