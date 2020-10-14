const setText: Notes.Handler<{
	text: Notes.State['text'];
}> = (state, { text }) => {
	return { ...state, text };
};

// TODO: layout change should not be reversible with ctrl+Z
const setLayout: Notes.Handler<{
	layout: Notes.State['layout'];
}> = (state, { layout }) => {
	return { ...state, layout };
};

export const handlers = {
	setText,
	setLayout,
};
