import React, { useRef, useState } from 'react';
import { Button, Classes, Dialog } from '@blueprintjs/core';

import './dialog.scss';

import { TaskList } from './TaskList';
import { bem } from '../../../utils';

const classes = bem('task-dialog', ['form', 'input'] as const);

const ToolbarContent: React.FC<{ dispatch: TaskList.Dispatch }> = ({
	dispatch,
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const addButton = useRef<HTMLElement>(null);
	const form = useRef<HTMLFormElement>(null);

	const onDialogOpen = () => {
		setIsDialogOpen(true);
	};

	const onDialogClose = () => {
		setIsDialogOpen(false);
		form.current?.reset();
	};

	const onAfterDialogClose = () => {
		addButton.current?.focus();
	};

	const onAddTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		if (!input.value) return;

		dispatch.addTask({ text: input.value });
		onDialogClose();
	};

	// TODO: add showDialog function to react context?
	return (
		<>
			<Button
				text='Add task'
				icon='plus'
				intent='success'
				onClick={onDialogOpen}
				elementRef={addButton}
			/>
			<Dialog
				className={classes.taskDialogBlock(null, Classes.DARK)}
				onClosed={onAfterDialogClose}
				isOpen={isDialogOpen}
				onClose={onDialogClose}
			>
				<form
					onSubmit={onAddTask}
					ref={form}
					className={classes.formElement()}
				>
					<input
						type='text'
						autoFocus
						className={classes.inputElement(
							null,
							Classes.INPUT,
							Classes.FILL
						)}
						placeholder='Enter task'
					/>
				</form>
			</Dialog>
		</>
	);
};

export const render: Plugin.Render<TaskList.State, TaskList.Dispatch> = (
	state,
	dispatch
) => {
	return {
		main: <TaskList state={state} dispatch={dispatch} />,
		toolbarContent: <ToolbarContent dispatch={dispatch} />,
	};
};
