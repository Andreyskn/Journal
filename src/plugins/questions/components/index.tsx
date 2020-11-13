import { useRef, useState } from 'react';
import { Button, Dialog, Classes } from '@blueprintjs/core';
import { Questionary } from './Questionary';

const ToolbarContent: React.FC<{ dispatch: Questions.Dispatch }> = ({
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

	const onAddQuestion = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		if (!input.value) return;

		dispatch.addQuestion({ question: input.value });
		onDialogClose();
	};

	return (
		<>
			<Button
				text='Add question'
				icon='plus'
				intent='success'
				onClick={onDialogOpen}
				elementRef={addButton}
			/>
			<Dialog
				className={Classes.DARK}
				style={{ padding: 15 }}
				onClosed={onAfterDialogClose}
				isOpen={isDialogOpen}
				onClose={onDialogClose}
			>
				<form onSubmit={onAddQuestion} ref={form}>
					<input
						type='text'
						autoFocus
						className={Classes.INPUT + ' ' + Classes.FILL}
						placeholder='Enter question'
					/>
				</form>
			</Dialog>
		</>
	);
};

export const render: Plugin.Render<Questions.State, Questions.Dispatch> = (
	state,
	dispatch
) => {
	return {
		main: <Questionary state={state} dispatch={dispatch} />,
		toolbarContent: <ToolbarContent dispatch={dispatch} />,
	};
};
