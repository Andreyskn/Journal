import React, { useEffect, useRef, useState } from 'react';
import './task-item.scss';
import { bem } from '../../../utils';
import {
	Button,
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
	'more',
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
	done,
	text,
	dispatch,
	priority,
	inProgress,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const onToggleDone = () => dispatch.toggleTaskDone({ id });

	const onToggleInProgress = () => dispatch.toggleInProgress({ id });

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
		<div className={classes.taskItemBlock({ done })}>
			<Popover
				position='bottom-left'
				minimal
				className={classes.priorityElement({ active: !done })}
				disabled={done}
			>
				<button
					type='button'
					className={classes.priorityTargetElement()}
				>
					<ProgressBar
						stripes={inProgress}
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
						active={inProgress}
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
				checked={done}
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
			<Popover
				position='bottom-right'
				minimal
				className={classes.moreElement()}
			>
				<Button icon='more' minimal />
				<Menu>
					<MenuItem
						icon='edit'
						text='Edit'
						onClick={() => setIsEditing(true)}
					/>
					<MenuItem icon='cross' text='Delete' onClick={onDelete} />
				</Menu>
			</Popover>
		</div>
	);
};
