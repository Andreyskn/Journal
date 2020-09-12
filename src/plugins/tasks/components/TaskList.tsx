import React from 'react';
import './task-list.scss';
import { useBEM } from '../../../utils';
import { TaskItem } from './TaskItem';
import {
	Classes,
	EditableText,
	H1,
	IEditableTextProps,
} from '@blueprintjs/core';
import { TasksDispatch } from '../dispatcher';

export type TaskListProps = {
	data: App.ImmutableTaskList;
	dispatch: TasksDispatch;
};

const [taskListBlock, taskListElement] = useBEM('task-list');

export const TaskList: React.FC<TaskListProps> = ({
	data: taskList,
	dispatch,
}) => {
	const addTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		if (!input.value) return;

		dispatch.addTask(input.value);
		event.currentTarget.reset();
	};

	const onTitleChange: IEditableTextProps['onConfirm'] = (value) => {
		dispatch.renameTaskList(value);
	};

	return (
		<div className={taskListBlock()}>
			<H1 className={taskListElement('title')}>
				<EditableText
					defaultValue={taskList.title}
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
				{taskList.items.toArray().map(([key, task]) => (
					<TaskItem key={key} task={task} dispatch={dispatch} />
				))}
			</div>
		</div>
	);
};
