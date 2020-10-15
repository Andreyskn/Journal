import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import './viewer.scss';

import { ErrorBoundary, createReducer, useStateRef, bem } from '../../utils';
import { PLUGINS, PLUGINS_MAP } from '../../plugins';
import { useSelector, useEnhancedDispatch } from '../../core';
import { Toolbar, ToolbarProps } from './Toolbar/Toolbar';

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

const classes = bem('viewer', ['toolbar', 'main'] as const);

const connectPlugin = ({ render, initState, handlers }: Plugin.LazyModule) => {
	const reducer = createReducer(handlers);

	const ConnectedPlugin: React.FC<{
		data: App.FileData;
		file: App.RegularFile;
	}> = ({ data, file }) => {
		const initialState = useMemo(() => initState(data.state), []);
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

		const { main, toolbarContent } = render(state, pluginDispatch);

		const viewerElement = useRef<HTMLDivElement>(null);

		const onFullscreen = () => {
			// TODO: add layout state to core
		};

		const onExport = () => {
			// TODO: use browser.downloads
			const text = `[${file.name}]::\n\n${PLUGINS_MAP[file.type].show(
				state
			)}`;
			const url = URL.createObjectURL(
				new Blob([text], {
					type: 'text/markdown',
				})
			);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `${file.name.replace(/\..*/, '')}.md`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		};

		const options: ToolbarProps['options'] = [
			{ icon: 'fullscreen', text: 'Fullscreen', onClick: onFullscreen },
			{ icon: 'export', text: 'Export', onClick: onExport },
		];

		return (
			<div className={classes.viewerBlock()} ref={viewerElement}>
				<div className={classes.toolbarElement()}>
					<Toolbar content={toolbarContent} options={options} />
				</div>
				<div className={classes.mainElement()}>{main}</div>
			</div>
		);
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
				<Plugin
					file={activeFile}
					data={activeDocument}
					key={activeDocument.id}
				/>
			</React.Suspense>
		</ErrorBoundary>
	);
};
