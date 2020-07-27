import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { createDispatch } from './tasksDispatch';
import { TaskList } from './TaskList';

export type TaskConnectorProps = {
	taskList: Model.ImmutableTaskList;
};

export const TasksConnector: React.FC<TaskConnectorProps> = ({ taskList }) => {
	const dispatch = useDispatch();
	const taskListId = taskList.get('id');

	const tasksDispatch = useMemo(
		() => createDispatch({ dispatch, taskListId }),
		[dispatch, taskListId]
	);

	return (
		<TaskList
			taskList={taskList}
			dispatch={tasksDispatch}
			key={taskListId}
		/>
	);
};
