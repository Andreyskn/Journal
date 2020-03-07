import React, { useEffect, Dispatch, useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../utils';
import { useDispatch } from 'react-redux';
import { Switch } from '@blueprintjs/core';
import { action } from '../../store';

export type TaskItemProps = {
	task: ImmutableTask;
};

const [taskItemBlock, taskItemElement] = useBEM('task-item');

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	useEffect(() => {
		console.log('changed', task.get('text'));
	}, [task]);

	const dispatch = useDispatch<Dispatch<TaskAction>>();

	const toggleDoneStatus = useCallback(() => {
		dispatch(action('@tasks/TOGGLE_DONE', task.get('timestamp')));
	}, []);

	return (
		<div className={taskItemBlock()}>
			<Switch
				checked={task.get('done')}
				label={task.get('text')}
				onChange={toggleDoneStatus}
				large
			/>
		</div>
	);
};
