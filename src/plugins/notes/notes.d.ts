import { handlers } from './handlers';

declare global {
	namespace Plugin {
		interface Registry {
			Notes: SetPlugin<'note', '.n'>;
		}
	}

	namespace Notes {
		type Dispatch = Plugin.Dispatch<typeof handlers>;

		type Handler<P extends AnyObject | undefined = undefined> = App.Handler<
			P,
			State
		>;

		type State = {
			text: string;
			layout: 'editor' | 'preview' | 'split';
		};
	}
}
