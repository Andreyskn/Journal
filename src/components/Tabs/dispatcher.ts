const createFile: Actions.Dispatcher<[type: App.RegularFile['type']]> = ({
	dispatch,
}) => (type) => {
	dispatch({
		type: '@fs/CREATE_UNTITLED_FILE',
		payload: {
			type,
		},
	});
};

const setActiveTab: Actions.Dispatcher<[id: App.Tab['id']]> = ({
	dispatch,
}) => (id) => {
	dispatch({
		type: '@fs/SET_ACTIVE_FILE',
		payload: { id },
	});
};

export const dispatchers = {
	createFile,
	setActiveTab,
};

export type TabsDispatch = Actions.DispatcherMap<typeof dispatchers>;
