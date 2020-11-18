import { handlers } from './handlers';

declare global {
	namespace Plugin {
		interface Registry {
			Notes: SetPlugin<'note', '.n'>;
		}
	}

	namespace Notes {
		type Dispatch = Actions.Dispatch<typeof handlers>;

		type Handler<
			P extends AnyObject | undefined = undefined
		> = Actions.Handler<P, State>;

		type State = {
			text: string;
			layout: 'editor' | 'preview' | 'split';
		};
	}
}
