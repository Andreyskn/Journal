import { handlers } from './handlers';

declare global {
	namespace Plugin {
		interface Registry {
			note: SetPlugin<
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
