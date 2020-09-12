export const UNTITLED = 'Untitled';

export const SEP = '/';

export const ROOT_NAME = '';

export const DIRECTORY_ID = {
	root: 'root',
	main: 'main',
	trash: 'trash',
	favorites: 'favorites',
};

export const PATHS = {
	root: ROOT_NAME,
	main: [ROOT_NAME, DIRECTORY_ID.main].join(SEP),
	trash: [ROOT_NAME, DIRECTORY_ID.trash].join(SEP),
	favorites: [ROOT_NAME, DIRECTORY_ID.favorites].join(SEP),
};
