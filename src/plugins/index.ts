type Config = Plugin.Configuration<keyof Plugin.Registry>;

const ctx = require.context('.', true, /config\.ts/);

export const PLUGINS = ctx
	.keys()
	.map((key) => ctx<{ config: Config }>(key).config)
	.sort((a, b) => a.order - b.order) as ReadonlyArray<Config>;

export const PLUGINS_MAP = Object.fromEntries(
	PLUGINS.map((p) => [p.type, p])
) as Readonly<Record<App.FileType, Config>>;

export const EXTENSIONS = PLUGINS.map((p) => p.extension) as ReadonlyArray<
	App.FileExtension
>;

export const TYPE_BY_EXTENSION = Object.fromEntries(
	PLUGINS.map((p) => [p.extension, p.type])
) as Readonly<Record<App.FileExtension, App.FileType>>;
