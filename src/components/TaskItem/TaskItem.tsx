import React, { useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../utils';
import { useDispatch } from 'react-redux';
import { Switch, Button } from '@blueprintjs/core';
import { action } from '../../store';

export type TaskItemProps = {
	task: ImmutableTask;
};

const [taskItemBlock, taskItemElement] = useBEM('task-item');

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	const dispatch = useDispatch<TaskDispatch>();

	const toggleDoneStatus = useCallback(() => {
		dispatch(action('@tasks/TOGGLE_DONE', task.get('timestamp')));
	}, []);

	const deleteTask = useCallback(() => {
		dispatch(action('@tasks/DELETE_TASK', task.get('timestamp')));
	}, []);

	return (
		<div className={taskItemBlock()}>
			<Switch
				checked={task.get('done')}
				label={task.get('text')}
				onChange={toggleDoneStatus}
				large
			/>
			<Button
				icon='delete'
				intent='danger'
				minimal
				className={taskItemElement('delete-btn')}
				onClick={deleteTask}
			/>
		</div>
	);
};
