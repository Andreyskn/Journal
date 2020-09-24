import React from 'react';
import { addHandlers, useDispatch } from '../core';

type PluginModule = {
	Component: React.FC<App.PluginComponentProps<any, any>>;
	dispatchers: Record<string, Actions.Dispatcher<any[], any>>;
	handlers: Record<any, App.Handler<any, any>>;
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

		return (
			<Component
				isStubData={Object.keys(data).length === 1}
				data={data}
				dispatch={dispatch}
				key={data.id}
			/>
		);
	};

	return { default: ConnectedPlugin };
};

export const connectedPlugins = {
	'task-list': React.lazy(() => import('./tasks').then(connectPlugin)),
	note: React.lazy(() => import('./notes').then(connectPlugin)),
	questions: React.lazy(() => import('./questions').then(connectPlugin)),
	/* connectedPlugin */
};
