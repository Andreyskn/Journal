import { handlers } from './handlers';
import { dispatchers } from './dispatcher';

declare global {
	namespace Questions {
		type Dispatch = Actions.DispatcherMap<typeof dispatchers>;

		type Dispatcher<T extends any[] = undefined[]> = Actions.Dispatcher<
			T,
			{},
			Actions.ExtractActions<typeof handlers>
		>;

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
		};
	}
}
