import React from 'react';

const Console: React.FC = () => {
	return <div>Not implemented</div>;
};

const windowModule: App.WindowModule = {
	id: 'console',
	icon: 'console',
	title: 'Console',
	Content: Console,
	menuEntry: {
		order: 2,
	},
};

export const { id, icon, title, Content, menuEntry } = windowModule;
