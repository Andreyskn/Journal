import Immutable from 'immutable';
import { createTaskList } from './helpers';

const taskList = createTaskList();

const tasksState: App.TasksState = {
	data: Immutable.Map([[taskList.id, taskList]]),
};

export const tasksDefaults = {
	taskList,
	tasksState,
};
