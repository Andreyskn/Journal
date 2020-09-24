type NoteHandler<P extends AnyObject | undefined = undefined> = App.Handler<
	P,
	Plugin.Note
>;

const initState: Plugin.InitStateHandler<Plugin.Note> = (_, { data }) => {
	return {
		...data,
		text: '',
	};
};

const saveNote: NoteHandler<{
	text: Plugin.Note['text'];
}> = (state, { text }) => {
	return { ...state, text };
};

export const handlers = {
	'@notes/INIT': initState,
	'@notes/SAVE': saveNote,
};
