import React, { useRef } from 'react';
import { ITreeProps, ITreeNode } from '@blueprintjs/core';
import { fileIcons } from '../../utils';
import { FileTreeProps } from './FileTree';
import { NewItem } from './NewItem';
import { fileTreeElement, NewItemData } from './common';
import { DIRECTORY_ID } from '../../core/fileSystem/constants';

export type TreeProps = OmitType<
	ITreeProps<any>,
	| 'onNodeClick'
	| 'onNodeCollapse'
	| 'onNodeExpand'
	| 'contents'
	| 'onNodeContextMenu'
> & {
	contents: TreeNode[];
	onNodeClick: (node: Node) => void;
	onNodeContextMenu: (
		node: Node,
		nodePath: number[],
		e: React.MouseEvent<HTMLElement>
	) => void;
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

type FolderNodeData = { type: 'folder'; path: Path; parent: FolderNode | null };
type FileNodeData = { type: 'file'; path: Path; parent: FolderNode };
type NodeData = FolderNodeData | FileNodeData;

type FolderNode = InnerNode<FolderNodeData>;
type FileNode = LeafNode<FileNodeData>;
export type Node = FolderNode | FileNode;

type NodesMap = {
	folders: Map<FolderNode['nodeData']['path'], FolderNode>;
	files: Map<FileNode['nodeData']['path'], FileNode>;
};

const getNodeClass = (isNew: boolean) => {
	return fileTreeElement('node', { new: isNew });
};

const createFolderNode = ({
	label = '',
	id = '',
	isExpanded = true,
	isSelected = false,
	isNew = false,
	parent,
	hasCaret,
	path,
}: Partial<
	Pick<
		FolderNode,
		'label' | 'id' | 'isExpanded' | 'isSelected' | 'className' | 'hasCaret'
	>
> & {
	isNew?: boolean;
	parent: FolderNode | null;
	path: Path;
}): FolderNode => ({
	id,
	label,
	isExpanded,
	isSelected,
	childNodes: [],
	nodeData: { type: 'folder', parent, path },
	icon: isExpanded ? 'folder-open' : 'folder-close',
	hasCaret: hasCaret ?? !isNew,
	className: getNodeClass(isNew),
});

const createFileNode = ({
	label = '',
	id = '',
	isSelected = false,
	type,
	parent,
	isNew = false,
	path,
}: Partial<
	Pick<FileNode, 'id' | 'label' | 'isSelected' | 'className'> &
		Pick<App.RegularFile, 'type'>
> & { isNew?: boolean; parent: FolderNode; path: Path }): FileNode => ({
	id,
	label,
	isSelected,
	nodeData: { type: 'file', parent, path },
	icon: type ? fileIcons[type] : 'document',
	className: getNodeClass(isNew),
});

export const expandParentFolders = ({ nodeData: { parent } }: Node) => {
	while (parent) {
		parent.isExpanded = true;
		parent = parent.nodeData.parent;
	}
};

const maybeAppendNewItem = (folder: FolderNode, newItem: NewItemData) => {
	if (!newItem || folder.id !== newItem.cwd) return;

	const createNode =
		newItem.type === 'folder' ? createFolderNode : createFileNode;
	const newItemNode = createNode({
		label: <NewItem {...newItem} />,
		isNew: true,
		parent: folder,
		path: '*',
	});

	folder.childNodes.push(newItemNode);
	expandParentFolders(newItemNode);
};

export const isFolderNode = (node: Node): node is FolderNode => {
	return node.nodeData.type === 'folder';
};

export const useTree = (
	files: FileTreeProps['files'],
	newItem: NewItemData,
	selectedPath: string | null
) => {
	const prevNodesMap = useRef<NodesMap | undefined>();
	const rootDir = files.get(DIRECTORY_ID.main)!;
	const rootNode = createFolderNode({
		id: rootDir.id,
		path: rootDir.path,
		parent: null,
	});
	const nodesMap: NodesMap = {
		folders: new Map([[rootNode.nodeData.path, rootNode]]),
		files: new Map(),
	};

	const isSelected = (path: Node['nodeData']['path']) =>
		!newItem && path === selectedPath;

	const fillDirectory = (parent: FolderNode) => {
		const file = files.get(parent.id) as App.Directory;

		const directories = file.data.takeWhile(
			(id) => files.get(id)!.type === 'directory'
		);
		const regularFiles = file.data.slice(directories.size);

		directories.forEach((id) => {
			const { name: label, path, data } = files.get(id) as App.Directory;

			const node = createFolderNode({
				parent,
				id,
				path,
				label,
				isSelected: isSelected(path),
				isExpanded: prevNodesMap.current?.folders.get(path)?.isExpanded,
				hasCaret: (data as App.Directory['data']).size > 0,
			});

			fillDirectory(node);
			nodesMap.folders.set(path, node);
			parent.childNodes.push(node);
		});

		maybeAppendNewItem(parent, newItem);

		regularFiles.forEach((id) => {
			const { type, name: label, path } = files.get(
				id
			) as App.RegularFile;

			const node = createFileNode({
				parent,
				label,
				id,
				path,
				type,
				isSelected: isSelected(path),
			});

			nodesMap.files.set(path, node);
			parent.childNodes.push(node);
		});
	};

	fillDirectory(rootNode);

	prevNodesMap.current = nodesMap;

	return { contents: rootNode.childNodes, nodesMap };
};
