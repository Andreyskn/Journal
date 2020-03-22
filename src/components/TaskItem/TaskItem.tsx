import React, { useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../utils';
import { Switch, Button } from '@blueprintjs/core';
import { useStore } from '../../store';

export type TaskItemProps = {
	task: ImmutableTask;
};

const [taskItemBlock, taskItemElement] = useBEM('task-item');

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	const { dispatch } = useStore();

	const toggleDoneStatus = useCallback(() => {
		dispatch.thunk.toggleDoneStatus(task.get('id'));
	}, []);

	const deleteTask = useCallback(() => {
		dispatch.thunk.deleteTask(task.get('id'));
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
