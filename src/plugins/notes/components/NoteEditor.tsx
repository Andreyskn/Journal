import React, { useCallback, useEffect } from 'react';
import { Classes, TextArea, ITextAreaProps } from '@blueprintjs/core';
import ReactMarkdown from 'react-markdown';

import './note-editor.scss';

import { useBEM } from '../../../utils';

type NoteEditorProps = Plugin.ComponentProps<Notes.State, Notes.Dispatch>;

const [noteEditorBlock, noteEditorElement] = useBEM('note-editor');

export const NoteEditor: React.FC<NoteEditorProps> = ({
	state: note,
	dispatch,
}) => {
	const onChange: ITextAreaProps['onChange'] = ({ target: { value } }) => {
		dispatch.setText(value);
	};

	return (
		<div className={noteEditorBlock()}>
			<TextArea
				large
				value={note.text}
				growVertically
				className={noteEditorElement('text-area')}
				onChange={onChange}
			/>
			<ReactMarkdown
				source={note.text}
				className={noteEditorElement(
					'viewer',
					null,
					Classes.RUNNING_TEXT
				)}
			/>
		</div>
	);
};
