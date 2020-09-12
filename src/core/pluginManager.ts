import Immutable from 'immutable';
import React from 'react';
import { IconName, MaybeElement } from '@blueprintjs/core';
import { wrapPluginComponent } from '../utils';

type CachedFields = Partial<{
	extensions: PluginData['extension'][];
	handlers: App.ActionHandlers;
	array: PluginData[];
	typeByExt: Record<PluginData['extension'], PluginData['type']>;
}>;

const cache = new WeakMap<typeof _plugins, CachedFields>();

const getCache = () => {
	if (!cache.has(_plugins)) {
		cache.set(_plugins, {});
	}
	return cache.get(_plugins)!;
};

const getCachedField = <T extends keyof CachedFields>(
	field: T,
	init: () => CachedFields[T]
) => {
	const cache = getCache();
	if (!cache[field]) {
		cache[field] = init();
	}
	return cache[field]!;
};

type PluginData = OmitType<
	RawPluginData,
	'handlers' | 'dispatchers' | 'component'
> & {
	handlers: App.ActionHandlers;
	component: App.PluginComponent;
};

let _plugins = Immutable.Map<keyof App.Plugins, PluginData>();

const getPluginsArray = () =>
	getCachedField('array', () => _plugins.toIndexedSeq().toArray());

const map: PluginData[]['map'] = (...args) => {
	return getPluginsArray().map(...args);
};

const get = (type: keyof App.Plugins) => _plugins.get(type);

export const plugins = {
	map,
	get,
	get extensions() {
		return getCachedField('extensions', () =>
			getPluginsArray().map((p) => p.extension)
		);
	},
	get handlers() {
		return getCachedField('handlers', () =>
			getPluginsArray().flatMap((p) => p.handlers)
		);
	},
	getTypeByExt: (extension: PluginData['extension']) => {
		return getCachedField('typeByExt', () =>
			getPluginsArray().reduce((result, plugin) => {
				result[plugin.extension] = plugin.type;
				return result;
			}, {} as NonNullable<CachedFields['typeByExt']>)
		)[extension];
	},
};

type RawPluginData<
	T extends AnyObject = App.Plugins[keyof App.Plugins]['data']
> = {
	type: keyof App.Plugins;
	label: string;
	icon: IconName | MaybeElement;
	extension: string;
	component: App.RawPluginComponent<T>;
	sample: T;
	dispatchers: Record<string, Actions.Dispatcher<any[]>>;
	handlers: App.ActionHandlers<T>;
	init: (initializer: { id: string } & AnyObject) => T;
};

export const registerPlugin = <
	T extends App.Plugins[keyof App.Plugins]['data']
>(
	data: RawPluginData<T>
) => {
	const wrappedHandlers: App.ActionHandlers = data.handlers.map(
		([type, handler]) => [
			type,
			(state, payload) => {
				const pluginDataId = (state.files.get(
					state.activeFile.id!
				) as App.RegularFile).data;
				const pluginState = state.data.get(pluginDataId);
				const newPluginState = handler(pluginState as any, payload);

				return state.update('data', (data) =>
					data.set(pluginDataId, newPluginState)
				);
			},
		]
	);

	_plugins = _plugins.set(data.type, {
		...data,
		handlers: wrappedHandlers,
		component: wrapPluginComponent(data.component as any, data.dispatchers),
	} as PluginData);
};

export const dropPlugin = (type: RawPluginData['type']) => {
	_plugins.delete(type);
};

declare global {
	namespace App {
		interface Plugins {}

		type PluginType<
			T extends AnyObject & { id: string },
			A extends Actions.AnyAction
		> = {
			data: T;
			actions: A;
		};

		type RawPluginComponent<
			T extends AnyObject = App.Plugins[keyof App.Plugins]['data']
		> = React.ComponentType<{
			data: T;
			dispatch: Actions.DispatcherMap<any>;
		}>;

		type PluginComponent<
			T extends AnyObject = App.Plugins[keyof App.Plugins]['data']
		> = React.ComponentType<{ data: T; dispatch: Actions.Dispatch }>;
	}
}
