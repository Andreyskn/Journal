export const config: Plugin.Configuration = {
	order: 2,
	type: 'note',
	extension: '.n',
	icon: 'manual',
	label: 'Note',
	getLazyModule: () => import('./init'),
};
