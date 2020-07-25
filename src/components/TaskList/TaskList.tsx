import React from 'react';
import './task-list.scss';
import { useBEM } from '../../utils';
import { TaskItem } from './TaskItem';
import {
	Classes,
	EditableText,
	H1,
	IEditableTextProps,
} from '@blueprintjs/core';

type AddTask = ActionBase<'ADD_TASK', Task['text']>;
type DeleteTask = ActionBase<'DELETE_TASK', Task['id']>;
type ToggleDone = ActionBase<'TOGGLE_TASK_DONE', Task['id']>;
type RenameTaskList = ActionBase<'RENAME_TASK_LIST', TaskList['title']>;

export type TaskListAction = AddTask | DeleteTask | ToggleDone | RenameTaskList;

export type TaskListProps = {
	taskList: ImmutableTaskList;
	onAction: (action: TaskListAction) => void;
};

const [taskListBlock, taskListElement] = useBEM('task-list');

export const TaskList: React.FC<TaskListProps> = ({ taskList, onAction }) => {
	const addTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		if (!input.value) return;

		onAction({ type: 'ADD_TASK', payload: input.value });
		event.currentTarget.reset();
	};

	const onTitleChange: IEditableTextProps['onConfirm'] = value => {
		onAction({ type: 'RENAME_TASK_LIST', payload: value });
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
					<TaskItem key={key} task={task} onAction={onAction} />
				))}
			</div>
		</div>
	);
};
