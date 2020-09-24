import { handlers } from './handlers';

declare global {
	namespace Plugin {
		interface Registry {
			questions: SetPlugin<
				'questions',
				'.qa',
				Actions.ExtractActions<typeof handlers>,
				Questions
			>;
		}

		type Questions = {
			id: string;
			example: string;
		};
	}
}
