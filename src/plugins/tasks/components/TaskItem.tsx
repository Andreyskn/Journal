import React, { useEffect, useRef, useState } from 'react';
import './task-item.scss';
import { bem } from '../../../utils';
import {
	Button,
	ButtonGroup,
	Checkbox,
	ITextAreaProps,
	Menu,
	MenuDivider,
	MenuItem,
	Popover,
	ProgressBar,
	TextArea,
} from '@blueprintjs/core';

export type TaskItemProps = TaskList.Task & {
	dispatch: TaskList.Dispatch;
};

const classes = bem('task-item', [
	'checkbox',
	'text',
	'controls',
	'priority',
	'priority-target',
	'text-editor',
	'indicator',
] as const);

type PriorityMenuItem = {
	icon: Icon;
	value: TaskList.Task['priority'];
	text: string;
};

const priorities: PriorityMenuItem[] = [
	{ icon: 'double-chevron-up', text: 'High', value: 'high' },
	{ icon: 'equals', text: 'Medium', value: 'medium' },
	{ icon: 'double-chevron-down', text: 'Low', value: 'low' },
];

export const TaskItem: React.FC<TaskItemProps> = ({
	id,
	text,
	dispatch,
	priority,
	status,
}) => {
	const isDone = status === 'done';
	const isInProgress = status === 'in-progress';

	const [isEditing, setIsEditing] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const onToggleDone = () => {
		dispatch.setTaskStatus({
			id,
			status: status === 'done' ? 'to-do' : 'done',
		});
	};

	const onToggleInProgress = () => {
		dispatch.setTaskStatus({
			id,
			status: status === 'in-progress' ? 'to-do' : 'in-progress',
		});
	};

	const onDelete = () => dispatch.deleteTask({ id });

	const onSetPriority = (priority: TaskList.Task['priority']) => () => {
		dispatch.setTaskPriority({ id, priority });
	};

	useEffect(() => {
		textareaRef.current?.select();
	}, [isEditing]);

	const onEdit: ITextAreaProps['onChange'] = (e) => {
		dispatch.setTaskText({ id, text: e.target.value });
	};

	const onBlur = () => setIsEditing(false);

	const onKeyDown: ITextAreaProps['onKeyDown'] = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			textareaRef.current?.blur();
		}
	};

	return (
		<div className={classes.taskItemBlock({ done: isDone })}>
			<Popover
				position='bottom-left'
				minimal
				className={classes.priorityElement({ active: !isDone })}
				disabled={isDone}
			>
				<button
					type='button'
					className={classes.priorityTargetElement()}
				>
					<ProgressBar
						stripes={isInProgress}
						className={classes.indicatorElement({
							[`priority-${priority}`]: priority !== 'medium',
						})}
					/>
				</button>
				<Menu>
					<MenuItem
						icon='build'
						text='In progress'
						onClick={onToggleInProgress}
						active={isInProgress}
					/>
					<MenuDivider title='Priority' />
					{priorities.map(({ icon, text, value }) => (
						<MenuItem
							key={value}
							icon={icon}
							text={text}
							onClick={onSetPriority(value)}
							active={priority === value}
						/>
					))}
				</Menu>
			</Popover>
			<Checkbox
				id={id}
				checked={isDone}
				onChange={onToggleDone}
				large
				className={classes.checkboxElement()}
			/>
			{isEditing ? (
				<TextArea
					inputRef={(ref) => (textareaRef.current = ref)}
					value={text}
					onChange={onEdit}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					growVertically
					fill
					className={classes.textEditorElement()}
				/>
			) : (
				<label htmlFor={id} className={classes.textElement()}>
					{text}
				</label>
			)}
			<ButtonGroup minimal className={classes.controlsElement()}>
				<Button
					icon='edit'
					onClick={() => setIsEditing(true)}
					title='Edit'
				/>
				<Button icon='trash' onClick={onDelete} title='Delete' />
			</ButtonGroup>
		</div>
	);
};
