import React from 'react';
import './task-list.scss';
import { bem } from '../../../utils';
import { TaskItem } from './TaskItem';

const classes = bem('task-list');

type TaskListProps = Plugin.ComponentProps<TaskList.State, TaskList.Dispatch>;

export const TaskList: React.FC<TaskListProps> = ({
	state: taskList,
	dispatch,
}) => {
	return (
		<div className={classes.taskListBlock()}>
			{taskList.tasks.map((task) => (
				<TaskItem key={task.id} {...task} dispatch={dispatch} />
			))}
		</div>
	);
};
