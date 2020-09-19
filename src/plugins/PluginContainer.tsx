import React from 'react';
import { addHandlers, useDispatch } from '../core';
import { ErrorBoundary } from '../utils';
import { PLUGINS_MAP } from './constants';

const connectPlugin = <
	T extends {
		Component: App.PluginComponent;
		dispatchers: any;
		handlers: any[];
	}
>({
	Component,
	dispatchers,
	handlers,
}: T) => {
	addHandlers(
		handlers.map(([type, handler]) => [
			type,
			(state, action) => {
				const pluginState = state.getIn(action.scope);
				return pluginState
					? state.setIn(action.scope, handler(pluginState, action))
					: state;
			},
		])
	);

	const ConnectedPlugin: App.ConnectedPluginComponent = ({ data }) => {
		const dispatch = useDispatch(dispatchers, undefined, {
			scope: ['data', data.id],
		});

		return <Component data={data} dispatch={dispatch} key={data.id} />;
	};

	return { default: ConnectedPlugin };
};

type PluginProps = {
	data: App.FileData;
	type: App.FileType;
};

//TODO: fix types
const PluginComponents: Record<any, React.LazyExoticComponent<any>> = {
	'task-list': React.lazy(() => import('./tasks').then(connectPlugin as any)),
	note: React.lazy(() => import('./notes').then(connectPlugin as any)),
};

export const PluginContainer: React.FC<PluginProps> = ({ data, type }) => {
	const Component = PluginComponents[type];
	return (
		<ErrorBoundary name={`${PLUGINS_MAP[type].label}`}>
			<React.Suspense fallback={null}>
				<Component data={data} />
			</React.Suspense>
		</ErrorBoundary>
	);
};
