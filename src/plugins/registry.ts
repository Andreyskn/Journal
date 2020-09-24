type PluginInfo = {
	type: App.FileType;
	extension: App.FileExtension;
	icon: Icon;
	label: string;
};

export const PLUGINS: readonly PluginInfo[] = [
	{
		type: 'task-list',
		extension: '.t',
		icon: 'form',
		label: 'Task List',
	},
	{
		type: 'note',
		extension: '.n',
		icon: 'manual',
		label: 'Note',
	},
	{
		type: 'questions',
		extension: '.qa',
		icon: 'help',
		label: 'Q & A',
	},
	/* pluginInfo */
];

export const PLUGINS_MAP = Object.fromEntries(
	PLUGINS.map((p) => [p.type, p])
) as Record<PluginInfo['type'], PluginInfo>;

export const EXTENSIONS = PLUGINS.map((p) => p.extension) as ReadonlyArray<
	typeof PLUGINS[number]['extension']
>;

export const TYPE_BY_EXTENSION = Object.fromEntries(
	PLUGINS.map((p) => [p.extension, p.type])
) as Record<App.FileExtension, App.FileType>;
