import { handlers } from './handlers';

declare global {
	namespace Plugin {
		interface Registry {
			TaskList: SetPlugin<'task-list', '.t'>;
		}
	}

	namespace TaskList {
		type Dispatch = Plugin.Dispatch<typeof handlers>;

		type Handler<
			P extends AnyObject | undefined = undefined
		> = Actions.Handler<P, State>;

		type State = {
			tasks: Task[];
		};

		type Task = {
			id: string;
			createdAt: Timestamp;
			text: string;
			priority: 'high' | 'medium' | 'low';
			status: 'to-do' | 'in-progress' | 'done';
		};
	}
}
