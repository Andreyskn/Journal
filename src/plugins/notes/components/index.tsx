import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { NoteEditor } from './NoteEditor';

type LayoutOption = {
	icon: IconType;
	value: Notes.State['layout'];
	text: string;
};

const layoutOptions: LayoutOption[] = [
	{ icon: 'manually-entered-data', text: 'Editor', value: 'editor' },
	{ icon: 'eye-open', text: 'Preview', value: 'preview' },
	{ icon: 'panel-stats', text: 'Split', value: 'split' },
];

const ToolbarContent: React.FC<{
	state: Notes.State;
	dispatch: Notes.Dispatch;
}> = ({ state, dispatch }) => {
	const onSetLayout = (layout: Notes.State['layout']) => () => {
		if (state.layout !== layout) {
			dispatch.setLayout({ layout });
		}
	};

	return (
		<ButtonGroup>
			{layoutOptions.map(({ icon, text, value }) => (
				<Button
					key={value}
					icon={icon}
					text={text}
					onClick={onSetLayout(value)}
					active={state.layout === value}
				/>
			))}
		</ButtonGroup>
	);
};

export const render: Plugin.Render<Notes.State, Notes.Dispatch> = (
	state,
	dispatch
) => {
	return {
		main: <NoteEditor state={state} dispatch={dispatch} />,
		toolbarContent: <ToolbarContent state={state} dispatch={dispatch} />,
	};
};
