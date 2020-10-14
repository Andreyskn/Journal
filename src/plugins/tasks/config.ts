const show: Plugin.Show<TaskList.State> = (state) => {
	return state.tasks
		.map(
			({ status, text }) => `- [${status === 'done' ? 'x' : ' '}] ${text}`
		)
		.join('\n');
};

export const config: Plugin.Configuration = {
	order: 1,
	type: 'task-list',
	extension: '.t',
	icon: 'form',
	label: 'Task List',
	getLazyModule: () => import('./init'),
	show: show,
};
