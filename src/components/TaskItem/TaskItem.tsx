import React, { useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../utils';
import { Switch, Button } from '@blueprintjs/core';
import { useDispatch } from '../../store';

export type TaskItemProps = {
	task: ImmutableTask;
};

const [itemBlock, itemElement] = useBEM('task-item');

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	const dispatch = useDispatch();

	const toggleDoneStatus = useCallback(() => {
		dispatch.tasksAction.toggleDoneStatus(task.id);
	}, []);

	const deleteTask = useCallback(() => {
		dispatch.tasksAction.deleteTask(task.id);
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
