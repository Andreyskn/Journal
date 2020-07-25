// import React from 'react';
// import { useSelector } from 'react-redux';
// import './file-tree.scss';
// import { Tree, ITreeProps } from '@blueprintjs/core';
// import { useBEM } from '../../utils';

// const [fileTreeBlock, fileTreeElement] = useBEM('file-tree');

// export const FileTree: React.FC = () => {
// 	const state = useSelector<ImmutableAppState, ImmutableAppState>(
// 		state => state
// 	);

// 	const files = state.getIn(['tasks', 'taskLists']).toArray();

// 	const treeProps: ITreeProps = {
// 		contents: files.map(([id, file]) => ({
// 			id,
// 			label: file.title,
// 			icon: 'tick',
// 			isSelected: state.activeDocument.contentId === id,
// 		})),
// 	};

// 	// treeProps.contents.push(
// 	// 	{
// 	// 		id: 1,
// 	// 		label: 'Label',
// 	// 		hasCaret: true,
// 	// 		icon: 'folder-close',
// 	// 	},
// 	// 	{
// 	// 		id: 2,
// 	// 		label: 'Label 2',
// 	// 		hasCaret: true,
// 	// 		icon: 'folder-open',
// 	// 		isExpanded: true,
// 	// 	}
// 	// );

// 	return (
// 		<div className={fileTreeBlock()}>
// 			<Tree {...treeProps} />
// 		</div>
// 	);
// };
