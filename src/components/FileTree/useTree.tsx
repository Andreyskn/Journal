import React, { useRef } from 'react';
import { ITreeProps, ITreeNode } from '@blueprintjs/core';
import { FileTreeProps } from './FileTree';
import { NodeEditor } from './NodeEditor';
import { classes, NodeEditorData, NodeEditorDataRename } from './common';
import { DIRECTORY_ID } from '../../core/fileSystem/constants';
import { PLUGINS_MAP } from '../../plugins';

// TODO: refactor. try composite pattern

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

const getNodeClass = (isEditing: boolean) => {
	return classes.nodeElement({ editing: isEditing });
};

const createFolderNode = ({
	label = '',
	id = '',
	isExpanded = false,
	isSelected = false,
	isNew = false,
	parent,
	hasCaret,
	path,
	editorData,
}: Partial<
	Pick<
		FolderNode,
		'label' | 'id' | 'isExpanded' | 'isSelected' | 'className' | 'hasCaret'
	>
> & {
	isNew?: boolean;
	parent: FolderNode | null;
	path: Path;
	editorData?: NodeEditorData;
}): FolderNode => {
	const isRenaming = editorData?.mode === 'rename' && editorData.id === id;

	return {
		id,
		label: isRenaming ? (
			<NodeEditor
				{...(editorData as NodeEditorDataRename)}
				name={label as string}
			/>
		) : (
			label
		),
		isExpanded,
		isSelected,
		childNodes: [],
		nodeData: { type: 'folder', parent, path },
		icon: isExpanded ? 'folder-open' : 'folder-close',
		hasCaret: hasCaret ?? !isNew,
		className: getNodeClass(isNew || isRenaming),
	};
};

const createFileNode = ({
	label = '',
	id = '',
	isSelected = false,
	type,
	parent,
	isNew = false,
	path,
	editorData,
}: Partial<
	Pick<FileNode, 'id' | 'label' | 'isSelected' | 'className'> &
		Pick<App.RegularFile, 'type'>
> & {
	isNew?: boolean;
	parent: FolderNode;
	path: Path;
	editorData?: NodeEditorData;
}): FileNode => {
	const isRenaming = editorData?.mode === 'rename' && editorData.id === id;
	return {
		id,
		label: isRenaming ? (
			<NodeEditor
				{...(editorData as NodeEditorDataRename)}
				name={label as string}
			/>
		) : (
			label
		),
		isSelected,
		nodeData: { type: 'file', parent, path },
		icon: type ? PLUGINS_MAP[type].icon : 'document',
		className: getNodeClass(isNew || isRenaming),
	};
};

export const expandParentFolders = ({ nodeData: { parent } }: Node) => {
	while (parent) {
		parent.isExpanded = true;
		parent = parent.nodeData.parent;
	}
};

const maybeAppendNewItem = (
	folder: FolderNode,
	nodeEditorData: NodeEditorData
) => {
	if (
		!nodeEditorData ||
		nodeEditorData.mode !== 'create' ||
		folder.id !== nodeEditorData.cwd
	)
		return;

	const createNode =
		nodeEditorData.type === 'folder' ? createFolderNode : createFileNode;
	const newItemNode = createNode({
		label: <NodeEditor {...nodeEditorData} />,
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

export const isEditingNode = (node: Node) => {
	return typeof node.label !== 'string';
};

export const useTree = (
	files: FileTreeProps['files'],
	editorData: NodeEditorData,
	selectedPath: Maybe<string>
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
		!editorData && path === selectedPath;

	const fillDirectory = (parent: FolderNode) => {
		const file = files.get(parent.id) as App.Directory;

		const directories = file.data.takeWhile(
			(id) => files.get(id)!.type === 'directory'
		);
		const regularFiles = file.data.slice(directories.size);

		directories.forEach((id) => {
			const { name: label, path, data, isTrashed } = files.get(
				id
			) as App.Directory;
			if (isTrashed) return;

			const node = createFolderNode({
				editorData,
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

		maybeAppendNewItem(parent, editorData);

		regularFiles.forEach((id) => {
			const { type, name: label, path, isTrashed } = files.get(
				id
			) as App.RegularFile;
			if (isTrashed) return;

			const node = createFileNode({
				editorData,
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
