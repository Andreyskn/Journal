const ctx = require.context('.', true, /config\.ts/);

export const PLUGINS = ctx
	.keys()
	.map((key) => ctx<{ config: Plugin.Configuration }>(key).config)
	.sort((a, b) => a.order - b.order) as ReadonlyArray<Plugin.Configuration>;

export const PLUGINS_MAP = Object.fromEntries(
	PLUGINS.map((p) => [p.type, p])
) as Readonly<Record<Plugin.Configuration['type'], Plugin.Configuration>>;

export const EXTENSIONS = PLUGINS.map((p) => p.extension) as ReadonlyArray<
	typeof PLUGINS[number]['extension']
>;

export const TYPE_BY_EXTENSION = Object.fromEntries(
	PLUGINS.map((p) => [p.extension, p.type])
) as Readonly<Record<App.FileExtension, App.FileType>>;
