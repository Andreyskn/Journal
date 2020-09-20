const saveNote: Actions.Dispatcher<[text: App.Note['text']]> = ({
	dispatch,
}) => (text) => {
	dispatch({
		type: '@notes/SAVE',
		payload: {
			text,
		},
	});
};

export const dispatchers = {
	saveNote,
};

export type NotesDispatch = Actions.DispatcherMap<typeof dispatchers>;
