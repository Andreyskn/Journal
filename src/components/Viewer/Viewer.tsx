import React, { useCallback, useEffect, useMemo } from 'react';

import './viewer.scss';

import {
	ErrorBoundary,
	createReducer,
	initDispatchers,
	useStateRef,
} from '../../utils';
import { PLUGINS, PLUGINS_MAP } from '../../plugins/registry';
import { useDispatch, useSelector } from '../../core';

const setFileDataState: Actions.Dispatcher<[
	id: App.File['id'],
	dataState: App.FileData['state']
]> = ({ dispatch }) => (id, dataState) => {
	dispatch({
		type: '@fs/SET_FILE_DATA_STATE',
		payload: {
			id,
			dataState,
		},
	});
};

const connectPlugin = ({
	Component,
	init,
	dispatchers,
	handlers,
}: Plugin.LazyModule) => {
	const reducer = createReducer(handlers);

	const ConnectedPlugin: React.FC<{ data: App.FileData }> = ({ data }) => {
		const initialState = useMemo(() => init(data.state), []);
		const [state, setState, stateRef] = useStateRef(initialState);

		const coreDispatch = useDispatch({ setFileDataState });

		const localDispatch = useCallback((action: Actions.AnyAction) => {
			setState(reducer(stateRef.getState(), action));
		}, []);

		const dispatch = useMemo(
			() => initDispatchers(localDispatch, dispatchers),
			[]
		);

		const saveState = useCallback(() => {
			if (!stateRef.hasChanged()) return;
			coreDispatch.setFileDataState(data.id, stateRef.getState());
		}, []);

		useEffect(() => {
			window.addEventListener('beforeunload', saveState);
			return () => {
				saveState();
				window.removeEventListener('beforeunload', saveState);
			};
		}, []);

		return <Component state={state} dispatch={dispatch} />;
	};

	return { default: ConnectedPlugin };
};

const pluginComponents = Object.fromEntries(
	PLUGINS.map((p) => [
		p.type,
		React.lazy(() => p.getLazyModule().then(connectPlugin)),
	])
) as Readonly<
	Record<
		Plugin.Configuration['type'],
		React.LazyExoticComponent<ReturnType<typeof connectPlugin>['default']>
	>
>;

export const Viewer: React.FC = () => {
	const { activeFileId, data, files } = useSelector((state) => ({
		activeFileId: state.activeFile.id,
		files: state.files,
		data: state.data,
	}));

	const activeFile =
		activeFileId && (files.get(activeFileId) as App.RegularFile);

	const activeDocument = activeFile && data.get(activeFile.data);

	if (!activeFile || !activeDocument) return null;

	const Plugin = pluginComponents[activeFile.type];

	return (
		<ErrorBoundary name={`${PLUGINS_MAP[activeFile.type].label}`}>
			<React.Suspense fallback={null}>
				<Plugin data={activeDocument} key={activeDocument.id} />
			</React.Suspense>
		</ErrorBoundary>
	);
};
