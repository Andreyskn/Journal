import React from 'react';

import './questionary.scss';
import { Classes, TextArea } from '@blueprintjs/core';

import { useBEM } from '../../../utils';
import { QAItem } from './QAItem';

type QuestionaryProps = Plugin.ComponentProps<
	Questions.State,
	Questions.Dispatch
>;

const [questionaryBlock, questionaryElement] = useBEM('questionary');

export const Questionary: React.FC<QuestionaryProps> = ({
	state: questionary,
	dispatch,
}) => {
	const addQuestion = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		if (!input.value) return;

		dispatch.addQuestion({ question: input.value });
		event.currentTarget.reset();
	};

	return (
		<div className={questionaryBlock()}>
			<form onSubmit={addQuestion} className={questionaryElement('form')}>
				<input
					type='text'
					className={questionaryElement(
						'input',
						null,
						Classes.INPUT,
						Classes.FILL,
						Classes.LARGE
					)}
					placeholder='New question'
				/>
			</form>
			<div>
				{questionary.items.map((qaBlock) => (
					<QAItem {...qaBlock} dispatch={dispatch} key={qaBlock.id} />
				))}
			</div>
		</div>
	);
};
