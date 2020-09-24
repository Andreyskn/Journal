import { handlers } from './handlers';

declare global {
	namespace App {
		interface PluginRegistry {
			note: Plugin<
				'note',
				'.n',
				Actions.ExtractActions<typeof handlers>,
				Note
			>;
		}

		type Note = {
			id: string;
			text: string;
		};
	}
}
