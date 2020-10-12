import { handlers } from './handlers';

declare global {
	namespace TaskList {
		type Dispatch = Plugin.Dispatch<typeof handlers>;

		type Handler<P extends AnyObject | undefined = undefined> = App.Handler<
			P,
			State
		>;

		type State = {
			title: string;
			tasks: Task[];
		};

		type Task = {
			id: string;
			createdAt: Timestamp;
			text: string;
			done: boolean;
			priority: 'high' | 'medium' | 'low';
			inProgress: boolean;
		};
	}
}
