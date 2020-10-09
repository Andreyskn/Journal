import React, { useCallback } from 'react';
import './task-item.scss';
import { bem } from '../../../utils';
import { Switch, Button } from '@blueprintjs/core';

export type TaskItemProps = TaskList.Task & {
	dispatch: TaskList.Dispatch;
};

const classes = bem('task-item', ['delete-btn'] as const);

export const TaskItem: React.FC<TaskItemProps> = ({
	id,
	done,
	text,
	dispatch,
}) => {
	const toggleDoneStatus = useCallback(() => {
		dispatch.toggleTaskDone({ id });
	}, []);

	const deleteTask = useCallback(() => {
		dispatch.deleteTask({ id });
	}, []);

	return (
		<div className={classes.taskItemBlock()}>
			<Switch
				checked={done}
				label={text}
				onChange={toggleDoneStatus}
				large
			/>
			<Button
				icon='delete'
				intent='danger'
				minimal
				className={classes.deleteBtnElement()}
				onClick={deleteTask}
			/>
		</div>
	);
};
