import React from 'react';
import { ErrorBoundary } from '../utils';
import { connectedPlugins } from './connector';
import { PLUGINS_MAP } from './registry';

type PluginContainerProps = {
	data: App.FileData;
	type: App.FileType;
};

export const PluginContainer: React.FC<PluginContainerProps> = ({
	data,
	type,
}) => {
	const Plugin = connectedPlugins[type];

	return (
		<ErrorBoundary name={`${PLUGINS_MAP[type].label}`}>
			<React.Suspense fallback={null}>
				<Plugin data={data} />
			</React.Suspense>
		</ErrorBoundary>
	);
};
