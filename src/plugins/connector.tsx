import React, { useLayoutEffect } from 'react';
import { addHandlers, useDispatch } from '../core';

type PluginModule = {
	Component: React.FC<Plugin.ComponentProps<any, any>>;
	dispatchers: { init: Plugin.InitStateDispatcher };
	handlers: Record<string, App.Handler<any, any>>;
};

const connectPlugin = ({ Component, dispatchers, handlers }: PluginModule) => {
	addHandlers(
		Object.entries(handlers).reduce((acc, [type, handler]) => {
			acc[type] = (
				state: App.ImmutableAppState,
				action: Actions.AppAction
			) => {
				const pluginState = state.getIn(action.scope!);
				return pluginState
					? state.setIn(
							action.scope!,
							handler(pluginState, action.payload as any)
					  )
					: state;
			};
			return acc;
		}, {} as AnyObject)
	);

	const ConnectedPlugin: React.FC<{ data: App.FileData }> = ({ data }) => {
		const dispatch = useDispatch(dispatchers, undefined, {
			scope: ['data', data.id],
		});

		const isStubData = Object.keys(data).length === 1;

		useLayoutEffect(() => {
			if (isStubData) dispatch.init(data);
		}, []);

		if (isStubData) return null;

		return <Component data={data} dispatch={dispatch} key={data.id} />;
	};

	return { default: ConnectedPlugin };
};

export const connectedPlugins = {
	'task-list': React.lazy(() => import('./tasks').then(connectPlugin)),
	note: React.lazy(() => import('./notes').then(connectPlugin)),
	questions: React.lazy(() => import('./questions').then(connectPlugin)),
	/* connectedPlugin */
};
