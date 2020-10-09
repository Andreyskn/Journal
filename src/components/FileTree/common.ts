import { bem } from '../../utils';
import { NodeEditorProps } from './NodeEditor';
import { Node } from './useTree';

export const classes = bem('file-tree', ['node'] as const);

export type NodeEditorDataCreate = { mode: 'create' } & OmitType<
	NodeEditorProps,
	'mode'
>;
export type NodeEditorDataRename = {
	mode: 'rename';
	id: Node['id'];
} & OmitType<NodeEditorProps, 'mode'>;

export type NodeEditorData = NodeEditorDataCreate | NodeEditorDataRename | null;
