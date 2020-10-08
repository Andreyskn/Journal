import { handlers } from './handlers';

declare global {
	namespace Questions {
		type Dispatch = Plugin.Dispatch<typeof handlers>;

		type Handler<P extends AnyObject | undefined = undefined> = App.Handler<
			P,
			State
		>;

		type State = {
			items: QABlock[];
		};

		type QABlock = {
			id: string;
			question: string;
			answer: string;
			isExpanded: boolean;
		};
	}
}
