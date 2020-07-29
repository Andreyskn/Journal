import React, { useRef, useReducer } from 'react';
import './file-tree.scss';
import {
	Tree,
	ITreeProps,
	ITreeNode,
	TreeEventHandler,
} from '@blueprintjs/core';
import { useBEM, fileIcons, useForceRender } from '../../utils';
import { FileTreeDispatch } from './FileTreeDispatcher';

const [fileTreeBlock, fileTreeElement] = useBEM('file-tree');

type FileTreeProps = Model.FileSystemState & {
	dispatch: FileTreeDispatch;
};

type LeafNode<T> = OmitType<
	ITreeNode,
	'childNodes' | 'nodeData' | 'isExpanded'
> & {
	nodeData: T;
};
type InnerNode<T> = LeafNode<T> & {
	childNodes: (LeafNode<NodeData> | InnerNode<NodeData>)[];
	isExpanded: boolean;
};

type FolderNodeData = { type: 'folder'; path: string };
type FileNodeData = { type: 'file'; path: string };
type NodeData = FolderNodeData | FileNodeData;

type FolderNode = InnerNode<FolderNodeData>;
type FileNode = LeafNode<FileNodeData>;
type Node = FolderNode | FileNode;

type FolderNodesMap = Map<Model.Folder['path'], FolderNode>;

const createTree = (
	{ folders, files, activeFilePath }: FileTreeProps,
	prevFolderNodeMap?: FolderNodesMap
) => {
	const rootFolder = folders.first(null)!;
	const rootNode: FolderNode = {
		id: rootFolder.path,
		label: '',
		childNodes: [],
		isExpanded: true,
		nodeData: { type: 'folder', path: rootFolder.path },
	};
	const folderNodesMap: FolderNodesMap = new Map([
		[rootFolder.path, rootNode],
	]);

	folders.forEach(folder => {
		const folderNode = folderNodesMap.get(folder.path)!;

		folder.content.folders.forEach(path => {
			const childFolder = folders.get(path)!;

			const childFolderNode: FolderNode = {
				id: path,
				label: childFolder.name,
				icon: 'folder-close',
				childNodes: [],
				nodeData: { type: 'folder', path },
				isExpanded: prevFolderNodeMap?.get(path)?.isExpanded ?? true,
			};

			folderNodesMap.set(path, childFolderNode);
			folderNode.childNodes.push(childFolderNode);
		});

		folder.content.files.forEach(path => {
			const file = files.get(path)!;

			const childFolderNode: FileNode = {
				id: path,
				label: file.path.base,
				icon: fileIcons[file.type],
				isSelected: path === activeFilePath,
				nodeData: { type: 'file', path },
			};

			folderNode.childNodes.push(childFolderNode);
		});
	});

	return { contents: rootNode.childNodes, folderNodesMap };
};

export const FileTree: React.FC<FileTreeProps> = props => {
	const { dispatch } = props;
	const { forceRender } = useForceRender();
	const prevFolderNodes = useRef<FolderNodesMap | undefined>();

	const { contents, folderNodesMap } = createTree(
		props,
		prevFolderNodes.current
	);
	prevFolderNodes.current = folderNodesMap;

	const onNodeClick: TreeEventHandler = (node, nodePath) => {
		const {
			nodeData: { type, path },
		} = node as Node;

		switch (type) {
			case 'file': {
				dispatch.setActiveFile(path);
				break;
			}
			case 'folder': {
				node.isExpanded = !node.isExpanded;
				forceRender();
				break;
			}
		}
	};

	const treeProps: ITreeProps<NodeData> = {
		contents,
		onNodeClick,
	};

	return (
		<div className={fileTreeBlock()}>
			<Tree {...treeProps} />
		</div>
	);
};
