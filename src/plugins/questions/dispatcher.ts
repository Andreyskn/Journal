const init: Plugin.InitStateDispatcher = ({ dispatch }) => (data) => {
	dispatch({
		type: '@notes/INIT',
		payload: {
			data,
		},
	});
};

export const dispatchers = {
	init,
};

export type QuestionsDispatch = Actions.DispatcherMap<typeof dispatchers>;
