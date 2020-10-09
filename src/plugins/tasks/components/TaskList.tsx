import React from 'react';
import './task-list.scss';
import { bem } from '../../../utils';
import { TaskItem } from './TaskItem';
import {
	Classes,
	EditableText,
	H1,
	IEditableTextProps,
} from '@blueprintjs/core';

const classes = bem('task-list', ['title', 'form', 'input'] as const);

type TaskListProps = Plugin.ComponentProps<TaskList.State, TaskList.Dispatch>;

export const TaskList: React.FC<TaskListProps> = ({
	state: taskList,
	dispatch,
}) => {
	const addTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		if (!input.value) return;

		dispatch.addTask({ text: input.value });
		event.currentTarget.reset();
	};

	const onTitleChange: IEditableTextProps['onConfirm'] = (title) => {
		dispatch.setTaskListTitle({ title });
	};

	return (
		<div className={classes.taskListBlock()}>
			<H1 className={classes.titleElement()}>
				<EditableText
					defaultValue={taskList.title}
					confirmOnEnterKey
					selectAllOnFocus
					onConfirm={onTitleChange}
				/>
			</H1>
			<form onSubmit={addTask} className={classes.formElement()}>
				<input
					type='text'
					className={classes.inputElement(
						null,
						Classes.INPUT,
						Classes.FILL
					)}
					placeholder='New task'
				/>
			</form>
			<div>
				{taskList.tasks.map((task) => (
					<TaskItem key={task.id} {...task} dispatch={dispatch} />
				))}
			</div>
		</div>
	);
};
