const example: Actions.Dispatcher<[example: string]> = ({
	dispatch,
}) => (example) => {
	dispatch({
		type: '@questions/EXAMPLE',
		payload: {
			example,
		},
	});
};

export const dispatchers = {
	example,
};

export type QuestionsDispatch = Actions.DispatcherMap<typeof dispatchers>;
