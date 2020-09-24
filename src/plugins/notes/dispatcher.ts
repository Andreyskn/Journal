const init: Plugin.InitStateDispatcher = ({ dispatch }) => (data) => {
	dispatch({
		type: '@notes/INIT',
		payload: {
			data,
		},
	});
};

const saveNote: Actions.Dispatcher<[text: Plugin.Note['text']]> = ({
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
	init,
	saveNote,
};

export type NotesDispatch = Actions.DispatcherMap<typeof dispatchers>;
