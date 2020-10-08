import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import './viewer.scss';

import { ErrorBoundary, createReducer, useStateRef } from '../../utils';
import { PLUGINS, PLUGINS_MAP } from '../../plugins';
import { useSelector, useEnhancedDispatch } from '../../core';

const useStateHistory = (
	initialState: unknown,
	setState: (state: unknown) => void
) => {
	const history = useRef<unknown[]>([initialState]);
	const cursor = useRef(0);

	const push = (state: unknown) => {
		const preserved = history.current.slice(0, cursor.current + 1);
		history.current = preserved.concat(state);
		cursor.current++;
	};

	const undo = () => {
		if (cursor.current > 0) {
			cursor.current--;
			setState(history.current[cursor.current]);
		}
	};

	const redo = () => {
		if (cursor.current < history.current.length - 1) {
			cursor.current++;
			setState(history.current[cursor.current]);
		}
	};

	const setReversibleState = (state: unknown) => {
		setState(state);
		push(state);
	};

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.code === 'KeyZ' && e.ctrlKey) {
			e.preventDefault();
			e.shiftKey ? redo() : undo();
		}
	}, []);

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	return { setReversibleState };
};

const connectPlugin = ({ Component, init, handlers }: Plugin.LazyModule) => {
	const reducer = createReducer(handlers);

	const ConnectedPlugin: React.FC<{ data: App.FileData }> = ({ data }) => {
		const initialState = useMemo(() => init(data.state), []);
		const [state, setState, stateRef] = useStateRef(initialState);
		const { setReversibleState } = useStateHistory(initialState, setState);

		const coreDispatch = useEnhancedDispatch();

		const localDispatch = useCallback((action: Actions.AnyAction) => {
			setReversibleState(reducer(stateRef.getState(), action));
		}, []);

		const pluginDispatch = useEnhancedDispatch({
			dispatch: localDispatch,
			handlers,
		});

		// TODO: add debounced save
		const saveState = useCallback(() => {
			if (!stateRef.hasChanged()) return;
			coreDispatch.fs.setFileDataState({
				id: data.id,
				dataState: stateRef.getState(),
			});
		}, []);

		useEffect(() => {
			window.addEventListener('beforeunload', saveState);
			return () => {
				saveState();
				window.removeEventListener('beforeunload', saveState);
			};
		}, []);

		return <Component state={state} dispatch={pluginDispatch} />;
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
	const { activeFile, data } = useSelector((state) => ({
		activeFile: state.activeFile.ref,
		data: state.data,
	}));

	const activeDocument = activeFile && data.get(activeFile.data);

	if (!activeFile || !activeDocument) return null; // TODO: add placeholder

	const Plugin = pluginComponents[activeFile.type];

	return (
		<ErrorBoundary name={`${PLUGINS_MAP[activeFile.type].label}`}>
			<React.Suspense fallback={null}>
				<Plugin data={activeDocument} key={activeDocument.id} />
			</React.Suspense>
		</ErrorBoundary>
	);
};
