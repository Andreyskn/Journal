import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TaskList, TaskListProps } from './TaskList';
import { checkUnhandled } from '../../utils';

// TODO: try using the same pattern as in redux store

export const TasksConnector: React.FC = () => {
	const dispatch = useDispatch();

	const state = useSelector<ImmutableAppState, ImmutableAppState>(
		state => state
	);

	const activeTab = state.tabsList.get(state.activeTabId)!;
	const taskList = state.getIn(activeTab.contentPath) as ImmutableTaskList;

	const onAction: TaskListProps['onAction'] = useCallback(
		action => {
			const taskListId = taskList.get('id');

			switch (action.type) {
				case 'ADD_TASK': {
					dispatch<AddTask>({
						type: '@tasks/ADD_TASK',
						payload: {
							taskListId,
							taskText: action.payload,
						},
					});
					break;
				}
				case 'DELETE_TASK': {
					dispatch<DeleteTask>({
						type: '@tasks/DELETE_TASK',
						payload: {
							taskListId,
							taskId: action.payload,
						},
					});
					break;
				}
				case 'TOGGLE_TASK_DONE': {
					dispatch<ToggleDoneTaskStatus>({
						type: '@tasks/TOGGLE_DONE',
						payload: {
							taskListId,
							taskId: action.payload,
						},
					});
					break;
				}
				case 'RENAME_TASK_LIST': {
					dispatch<RenameTaskList>({
						type: '@tasks/RENAME_TASK_LIST',
						payload: {
							taskListId,
							title: action.payload,
						},
					});
					break;
				}
				default:
					checkUnhandled(action);
			}
		},
		[taskList]
	);

	return (
		<TaskList taskList={taskList} onAction={onAction} key={taskList.id} />
	);
};
