import React from 'react';
import { Classes, TextArea, ITextAreaProps } from '@blueprintjs/core';
import ReactMarkdown from 'react-markdown';

import './note-editor.scss';

import { bem } from '../../../utils';

type NoteEditorProps = Plugin.ComponentProps<Notes.State, Notes.Dispatch>;

const classes = bem('note', ['editor', 'preview'] as const);

export const NoteEditor: React.FC<NoteEditorProps> = ({
	state: { text, layout },
	dispatch,
}) => {
	const onChange: ITextAreaProps['onChange'] = (e) => {
		dispatch.setText({ text: e.target.value });
	};

	return (
		<div className={classes.noteBlock({ [`layout-${layout}`]: true })}>
			{layout !== 'preview' && (
				<TextArea
					large
					value={text}
					growVertically
					className={classes.editorElement()}
					onChange={onChange}
				/>
			)}
			{layout !== 'editor' && (
				<ReactMarkdown
					source={text}
					className={classes.previewElement(
						null,
						Classes.RUNNING_TEXT
					)}
				/>
			)}
		</div>
	);
};
