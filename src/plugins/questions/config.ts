export const config: Plugin.Configuration = {
	order: 3,
	type: 'questions',
	extension: '.qa',
	icon: 'help',
	label: 'Q & A',
	getLazyModule: () => import('./init'),
};
