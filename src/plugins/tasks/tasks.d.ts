import { handlers } from './handlers';

declare global {
	namespace App {
		interface PluginRegistry {
			'task-list': Plugin<
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
