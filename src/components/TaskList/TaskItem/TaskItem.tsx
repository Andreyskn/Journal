import React, { useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../../utils';
import { Switch, Button } from '@blueprintjs/core';
import { TasksDispatch } from '../tasksDispatcher';

export type TaskItemProps = {
	task: Model.ImmutableTask;
	dispatch: TasksDispatch;
};

const [itemBlock, itemElement] = useBEM('task-item');

export const TaskItem: React.FC<TaskItemProps> = ({ task, dispatch }) => {
	const toggleDoneStatus = useCallback(() => {
		dispatch.toggleDone(task.id);
	}, []);

	const deleteTask = useCallback(() => {
		dispatch.deleteTask(task.id);
	}, []);

	return (
		<div className={itemBlock()}>
			<Switch
				checked={task.done}
				label={task.text}
				onChange={toggleDoneStatus}
				large
			/>
			<Button
				icon='delete'
				intent='danger'
				minimal
				className={itemElement('delete-btn')}
				onClick={deleteTask}
			/>
		</div>
	);
};
