import React, { Dispatch, useCallback } from 'react';
import './task-list.scss';
import { useBEM } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { TaskItem } from '../TaskItem';
import { action } from '../../store';

export type TaskListProps = {};

const [taskListBlock, taskListElement] = useBEM('task-list');

export const TaskList: React.FC<TaskListProps> = props => {
	const tasks = useSelector<AppState, AppState['tasks']>(
		state => state.tasks
	);

	const dispatch = useDispatch<Dispatch<TaskAction>>();

	const addTask = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const input = event.currentTarget.elements[0] as HTMLInputElement;

			if (!input.value) return;

			dispatch(action('@tasks/ADD', input.value));
			event.currentTarget.reset();
		},
		[dispatch]
	);

	return (
		<div className={taskListBlock()}>
			<form onSubmit={addTask}>
				<input type='text' />
			</form>
			<div>
				{tasks.toArray().map(([key, task]) => (
					<TaskItem key={key} task={task} />
				))}
			</div>
		</div>
	);
};
