import React from 'react';
import { Classes, TextArea, ITextAreaProps } from '@blueprintjs/core';
import ReactMarkdown from 'react-markdown';

import './note-editor.scss';

import { bem } from '../../../utils';

type NoteEditorProps = Plugin.ComponentProps<Notes.State, Notes.Dispatch>;

const classes = bem('note-editor', ['text-area', 'viewer'] as const);

export const NoteEditor: React.FC<NoteEditorProps> = ({
	state: note,
	dispatch,
}) => {
	const onChange: ITextAreaProps['onChange'] = (e) => {
		dispatch.setText({ text: e.target.value });
	};

	return (
		<div className={classes.noteEditorBlock()}>
			<TextArea
				large
				value={note.text}
				growVertically
				className={classes.textAreaElement()}
				onChange={onChange}
			/>
			<ReactMarkdown
				source={note.text}
				className={classes.viewerElement(null, Classes.RUNNING_TEXT)}
			/>
		</div>
	);
};
