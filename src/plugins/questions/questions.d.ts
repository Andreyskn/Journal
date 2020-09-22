import { handlers } from './handlers';

declare global {
	namespace App {
		interface PluginRegistry {
			'questions': Plugin<
				'questions',
				'.qa',
				Actions.ExtractActions<typeof handlers[number]>,
				Questions
			>;
		}

		type Questions = {
			id: string;
			example: string;
		};
	}
}
