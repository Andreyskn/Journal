import React, { useState } from 'react';

import './qa-item.scss';

import { useBEM } from '../../../utils';
import {
	Alignment,
	Button,
	ButtonGroup,
	Collapse,
	TextArea,
} from '@blueprintjs/core';

type QAItemProps = {
	qaBlock: Questions.QABlock;
};

const [itemBlock, itemElement] = useBEM('qa-item');

export const QAItem: React.FC<QAItemProps> = ({ qaBlock }) => {
	const [isAnswerOpen, setIsAnswerOpen] = useState(false);
	const [answer, setAnswer] = useState(qaBlock.answer);
	const [isEditing, setIsEditing] = useState(false);

	return (
		<div className={itemBlock()}>
			<ButtonGroup large fill>
				<Button
					icon='caret-down'
					onClick={() => setIsAnswerOpen(!isAnswerOpen)}
				/>
				<Button
					fill
					alignText={Alignment.LEFT}
					disabled={isEditing}
					onClick={() => setIsAnswerOpen(!isAnswerOpen)}
				>
					{isEditing ? (
						<TextArea
							defaultValue={qaBlock.question}
							growVertically
							fill
							large
							className={itemElement('textarea')}
						/>
					) : (
						qaBlock.question
					)}
				</Button>
				<Button icon='edit' onClick={() => setIsEditing(!isEditing)} />
				<Button
					icon='cross'
					onClick={() => setIsAnswerOpen(!isAnswerOpen)}
				/>
			</ButtonGroup>

			<Collapse isOpen={isAnswerOpen} keepChildrenMounted>
				<TextArea
					large
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					growVertically
					fill
					placeholder='Enter answer...'
					className={itemElement('textarea')}
				/>
			</Collapse>
		</div>
	);
};
