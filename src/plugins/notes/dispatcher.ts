const setText: Notes.Dispatcher<[text: Notes.State['text']]> = ({
	dispatch,
}) => (text) => {
	dispatch({
		type: 'SET_TEXT',
		payload: {
			text,
		},
	});
};

export const dispatchers = {
	setText,
};
