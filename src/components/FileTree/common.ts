import { useBEM } from '../../utils';
import { NodeEditorProps } from './NodeEditor';
import { Node } from './useTree';

export const [fileTreeBlock, fileTreeElement] = useBEM('file-tree');

export type NodeEditorDataCreate = { mode: 'create' } & OmitType<
	NodeEditorProps,
	'mode'
>;
export type NodeEditorDataRename = {
	mode: 'rename';
	id: Node['id'];
} & OmitType<NodeEditorProps, 'mode'>;

export type NodeEditorData = NodeEditorDataCreate | NodeEditorDataRename | null;
