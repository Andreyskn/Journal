import React from 'react';

const RecycleBin: React.FC = () => {
	return <div>Not implemented</div>;
};

const windowModule: App.WindowModule = {
	id: 'recycle',
	icon: 'trash',
	title: 'Recycle Bin',
	Content: RecycleBin,
	menuEntry: {
		order: 2,
	},
};

export const { id, icon, title, Content, menuEntry } = windowModule;
