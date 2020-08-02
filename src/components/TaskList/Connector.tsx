import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { createDispatch } from './dispatcher';
import { TaskList } from './TaskList';
import { withErrorBoundary } from '../../utils';

const WrappedTaskList = withErrorBoundary(TaskList);

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
		<WrappedTaskList
			taskList={taskList}
			dispatch={tasksDispatch}
			key={taskListId}
		/>
	);
};
