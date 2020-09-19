import React, { useEffect, useState } from 'react';
import { Classes, TextArea, ITextAreaProps } from '@blueprintjs/core';
import ReactMarkdown from 'react-markdown';
import './note-editor.scss';
import { useBEM } from '../../../utils';
import { NotesDispatch } from '../dispatcher';

type NoteEditorProps = App.PluginComponentProps<App.Note, NotesDispatch>;

const [noteEditorBlock, noteEditorElement] = useBEM('note-editor');

export const NoteEditor: React.FC<NoteEditorProps> = ({
	data: note,
	dispatch,
}) => {
	const [text, setText] = useState(note.text || '');

	const onChange: ITextAreaProps['onChange'] = ({ target: { value } }) => {
		setText(value);
		dispatch.saveNote(value);
	};

	return (
		<div className={noteEditorBlock()}>
			<TextArea
				large
				value={text}
				growVertically
				className={noteEditorElement('text-area')}
				onChange={onChange}
			/>
			<ReactMarkdown
				source={text}
				className={noteEditorElement(
					'viewer',
					null,
					Classes.RUNNING_TEXT
				)}
			/>
		</div>
	);
};
