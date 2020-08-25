import { Store as ReduxStore } from 'redux';

export type HandlerDeps = {
	store: ReduxStore<App.ImmutableAppState, Actions.AppAction>;
};

const createFile = ({ store: { dispatch, getState } }: HandlerDeps) => (
	type: App.RegularFile['type']
) => {
	dispatch({
		type: '@fs/CREATE_UNTITLED_FILE',
		payload: {
			type,
		},
	});
};

const setActiveTab = ({ store: { dispatch } }: HandlerDeps) => (
	id: App.Tab['id']
) => {
	dispatch({
		type: '@fs/SET_ACTIVE_FILE',
		payload: { id },
	});
};

export const createDispatch = (deps: HandlerDeps) => ({
	createFile: createFile(deps),
	setActiveTab: setActiveTab(deps),
});

export type TabsDispatch = ReturnType<typeof createDispatch>;
