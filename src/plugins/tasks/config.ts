export const config: Plugin.Configuration = {
	order: 1,
	type: 'task-list',
	extension: '.t',
	icon: 'form',
	label: 'Task List',
	getLazyModule: () => import('./init'),
};
