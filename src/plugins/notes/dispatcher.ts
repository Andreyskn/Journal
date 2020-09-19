import { debounce } from '../../utils';

const saveNote: Actions.Dispatcher<[text: App.Note['text']]> = ({ dispatch }) =>
	debounce((text) => {
		dispatch({
			type: '@notes/SAVE',
			payload: {
				text,
			},
		});
	}, 1000);

export const dispatchers = {
	saveNote,
};

export type NotesDispatch = Actions.DispatcherMap<typeof dispatchers>;
