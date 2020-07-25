import React, { useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../../utils';
import { Switch, Button } from '@blueprintjs/core';
import { TaskListAction } from '../TaskList';

export type TaskItemProps = {
	task: ImmutableTask;
	onAction: (action: TaskListAction) => void;
};

const [itemBlock, itemElement] = useBEM('task-item');

export const TaskItem: React.FC<TaskItemProps> = ({ task, onAction }) => {
	const toggleDoneStatus = useCallback(() => {
		onAction({ type: 'TOGGLE_TASK_DONE', payload: task.id });
	}, []);

	const deleteTask = useCallback(() => {
		onAction({ type: 'DELETE_TASK', payload: task.id });
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
