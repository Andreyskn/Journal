import React, { useCallback } from 'react';
import './task-list.scss';
import { useBEM } from '../../utils';
import { TaskItem } from '../TaskItem';
import { useStore } from '../../store';
import {
	Classes,
	EditableText,
	H1,
	IEditableTextProps,
} from '@blueprintjs/core';

export type TaskListProps = {
	taskList: ImmutableTaskList;
};

const [taskListBlock, taskListElement] = useBEM('task-list');

export const TaskList: React.FC<TaskListProps> = ({ taskList }) => {
	const { dispatch } = useStore();

	const addTask = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const input = event.currentTarget
				.elements[0] as HTMLTextAreaElement;

			if (!input.value) return;

			dispatch.tasksAction('@tasks/ADD_TASK', input.value);
			event.currentTarget.reset();
		},
		[dispatch]
	);

	const onTitleChange: IEditableTextProps['onConfirm'] = value => {
		dispatch.tasksAction('@tasks/RENAME_LIST', value);
	};

	return (
		<div className={taskListBlock()}>
			<H1 className={taskListElement('title')}>
				<EditableText
					defaultValue={taskList.get('title')}
					confirmOnEnterKey
					selectAllOnFocus
					onConfirm={onTitleChange}
				/>
			</H1>
			<form onSubmit={addTask} className={taskListElement('form')}>
				<input
					type='text'
					className={taskListElement(
						'input',
						null,
						Classes.INPUT,
						Classes.FILL
					)}
					placeholder='New task...'
				/>
			</form>
			<div>
				{taskList
					.get('tasks')
					.toArray()
					.map(([key, task]) => (
						<TaskItem key={key} task={task} />
					))}
			</div>
		</div>
	);
};
