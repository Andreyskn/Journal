import { actionHandler } from '../../utils';

type NoteHandler<P extends AnyObject | undefined = undefined> = App.Handler<
	P,
	App.Note
>;

const saveNote: NoteHandler<{
	text: App.Note['text'];
}> = (state, { text }) => {
	return { ...state, text };
};

export const handlers = [actionHandler('@notes/SAVE', saveNote)];