import React from 'react';
import { useDispatch } from '../../core/store';

import { dispatchers } from './dispatcher';
import { TaskList } from './TaskList';
import { withErrorBoundary } from '../../utils';

const WrappedTaskList = withErrorBoundary(TaskList);

export type TaskConnectorProps = {
	taskList: App.ImmutableTaskList;
};

export const TasksConnector: React.FC<TaskConnectorProps> = ({ taskList }) => {
	const taskListId = taskList.id;
	const tasksDispatch = useDispatch(dispatchers, { taskListId });

	return (
		<WrappedTaskList
			taskList={taskList}
			dispatch={tasksDispatch}
			key={taskListId}
		/>
	);
};
