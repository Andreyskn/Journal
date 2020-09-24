import { handlers } from './handlers';

declare global {
	namespace Plugin {
		interface Registry {
			'task-list': SetPlugin<
				'task-list',
				'.t',
				Actions.ExtractActions<typeof handlers>,
				TaskList
			>;
		}

		type TaskList = {
			id: string;
			title: string;
			tasks: Task[];
		};

		type Task = {
			id: string;
			createdAt: Timestamp;
			text: string;
			done: boolean;
		};
	}
}
