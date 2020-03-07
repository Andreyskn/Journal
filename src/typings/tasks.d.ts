import { Record, OrderedMap } from 'immutable';

declare global {
	type Task = {
		timestamp: number;
		text: string;
		done: boolean;
	};

	type ImmutableTask = Record<Task>;

	type TasksState = OrderedMap<Task['timestamp'], ImmutableTask>;
}
