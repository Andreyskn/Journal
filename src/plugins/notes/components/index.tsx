import React from 'react';
import { NoteEditor } from './NoteEditor';

export const render: Plugin.Render<Notes.State, Notes.Dispatch> = (
	state,
	dispatch
) => {
	return {
		main: <NoteEditor state={state} dispatch={dispatch} />,
	};
};
