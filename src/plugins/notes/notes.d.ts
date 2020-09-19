import { handlers } from './handlers';

declare global {
	namespace App {
		interface PluginRegistry {
			note: Plugin<
				'note',
				'.n',
				Actions.ExtractActions<typeof handlers[number]>,
				Note
			>;
		}

		type Note = {
			id: string;
			text: string;
		};
	}
}
