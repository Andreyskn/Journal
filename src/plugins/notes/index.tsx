import React from 'react';
// import { registerPlugin } from '../pluginManager';

const Note: React.FC = () => {
	return <div>123</div>;
};

// registerPlugin({
// 	extension: '.n',
// 	icon: 'manual',
// 	type: 'note',
// 	component: Note,
// 	dispatchers: {},
// 	handlers: [],
// 	init: () => ({ id: '1', text: 'test' }),
// 	label: 'Note',
// 	sample: { id: '0', text: 'test' },
// });

declare global {
	namespace App {
		interface PluginRegistry {
			note: Plugin<'note', '.n', never, Note>;
		}

		type Note = {
			id: string;
			text: string;
		};
	}
}

export { Note as default };
