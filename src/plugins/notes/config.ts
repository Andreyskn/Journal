const show: Plugin.Show<Notes.State> = (state) => state.text;

export const config: Plugin.Configuration<'Notes'> = {
	order: 2,
	type: 'note',
	extension: '.n',
	icon: 'manual',
	label: 'Note',
	getLazyModule: () => import('./init'),
	show,
};
