const show: Plugin.Show<Questions.State> = (state) => {
	return state.items
		.map(({ question, answer }) => `# ${question}\n> ${answer}`)
		.join('\n\n');
};

export const config: Plugin.Configuration<'Questions'> = {
	order: 3,
	type: 'questions',
	extension: '.q',
	icon: 'help',
	label: 'Q & A',
	getLazyModule: () => import('./init'),
	show,
};
