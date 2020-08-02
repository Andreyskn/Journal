import { useBEM } from '../../utils';
import { NewItemProps } from './NewItem';

export const [fileTreeBlock, fileTreeElement] = useBEM('file-tree');

export type NewItemData = NewItemProps | null;
