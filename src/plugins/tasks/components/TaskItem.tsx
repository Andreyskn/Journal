import React, { useCallback } from 'react';
import './task-item.scss';
import { useBEM } from '../../../utils';
import { Switch, Button } from '@blueprintjs/core';

export type TaskItemProps = TaskList.Task & {
	dispatch: TaskList.Dispatch;
};

const [itemBlock, itemElement] = useBEM('task-item');

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
		<div className={itemBlock()}>
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
				className={itemElement('delete-btn')}
				onClick={deleteTask}
			/>
		</div>
	);
};
