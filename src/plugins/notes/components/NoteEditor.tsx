import React, { useCallback, useEffect } from 'react';
import { Classes, TextArea, ITextAreaProps } from '@blueprintjs/core';
import ReactMarkdown from 'react-markdown';

import './note-editor.scss';

import { useBEM, useStateRef } from '../../../utils';
import { NotesDispatch } from '../dispatcher';

type NoteEditorProps = Plugin.ComponentProps<Plugin.Note, NotesDispatch>;

const [noteEditorBlock, noteEditorElement] = useBEM('note-editor');

export const NoteEditor: React.FC<NoteEditorProps> = ({
	data: note,
	dispatch,
}) => {
	const [text, setText, textRef] = useStateRef(note.text || '');

	const saveState = useCallback(() => {
		if (!textRef.hasChanged()) return;
		const text = textRef.getState();
		if (text !== note.text) dispatch.saveNote(text);
	}, []);

	useEffect(() => {
		window.addEventListener('beforeunload', saveState);

		return () => {
			saveState();
			window.removeEventListener('beforeunload', saveState);
		};
	}, []);

	const onChange: ITextAreaProps['onChange'] = ({ target: { value } }) => {
		setText(value);
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
