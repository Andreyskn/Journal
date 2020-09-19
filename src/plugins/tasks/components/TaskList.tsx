import React, { useLayoutEffect } from 'react';
import Immutable from 'immutable';
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

export type TaskListProps = App.PluginComponentProps<
	App.ImmutableTaskList | App.TaskList,
	TasksDispatch
>;

const [taskListBlock, taskListElement] = useBEM('task-list');

export const TaskList: React.FC<TaskListProps> = ({ data, dispatch }) => {
	const isValidState = Immutable.isRecord(data);

	useLayoutEffect(() => {
		if (!isValidState) {
			dispatch.init(data as any);
		}
	}, []);

	if (!isValidState) return null;

	const taskList = data as App.ImmutableTaskList;

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
