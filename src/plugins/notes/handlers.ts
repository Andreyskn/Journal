const setText: Notes.Handler<{
	text: Notes.State['text'];
}> = (state, { text }) => {
	return { ...state, text };
};

export const handlers = {
	SET_TEXT: setText,
};
