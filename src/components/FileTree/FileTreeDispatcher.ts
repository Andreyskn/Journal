import { Dispatch } from 'redux';

export type HandlerDeps = {
	dispatch: Dispatch<Model.AppAction>;
};

const setActiveFile = ({ dispatch }: HandlerDeps) => (
	filePath: Model.File['path']['absolute']
) => {
	dispatch<SetActiveFile>({
		type: '@fs/SET_ACTIVE_FILE',
		payload: filePath,
	});
};

export const createDispatch = (deps: HandlerDeps) => ({
	setActiveFile: setActiveFile(deps),
});

export type FileTreeDispatch = ReturnType<typeof createDispatch>;
