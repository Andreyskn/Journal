import { useRef, useState } from 'react';

import './qa-item.scss';

import { bem } from '../../../utils';
import {
	Alignment,
	Button,
	Collapse,
	TextArea,
	ITextAreaProps,
	ContextMenu,
	Menu,
	MenuItem,
	IButtonProps,
} from '@blueprintjs/core';

type QAItemProps = Questions.QABlock & {
	dispatch: Questions.Dispatch;
};

const classes = bem('qa-item', ['textarea', 'question'] as const);

export const QAItem: React.FC<QAItemProps> = ({
	id,
	question,
	answer,
	isExpanded,
	dispatch,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const answerRef = useRef<HTMLTextAreaElement | null>(null);
	const questionRef = useRef<HTMLTextAreaElement | null>(null);

	const onChangeAnswer: ITextAreaProps['onChange'] = (e) => {
		dispatch.setAnswer({ id, answer: e.target.value });
	};

	const onChangeQuestion: ITextAreaProps['onChange'] = (e) => {
		dispatch.setQuestion({ id, question: e.target.value });
	};

	const toggleExpanded = () => {
		dispatch.setExpanded({ id, isExpanded: !isExpanded });
	};

	const onBlur = () => setIsEditing(false);

	const onKeyDown: ITextAreaProps['onKeyDown'] = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			answerRef.current?.blur();
			questionRef.current?.blur();
		}
	};

	const onContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const onEdit = () => setIsEditing(true);

		const onDelete = () => dispatch.deleteQuestion({ id });

		ContextMenu.show(
			<Menu>
				<MenuItem icon='edit' text='Edit' onClick={onEdit} />
				<MenuItem icon='cross' text='Delete' onClick={onDelete} />
			</Menu>,
			{ left: e.pageX, top: e.pageY },
			undefined,
			true
		);
	};

	const intent = ((): IButtonProps['intent'] => {
		if (isExpanded) return 'none';
		return answer ? 'success' : 'danger';
	})();

	return (
		<div className={classes.qaItemBlock()}>
			{isEditing ? (
				<TextArea
					large
					inputRef={(ref) => (questionRef.current = ref)}
					value={question}
					onChange={onChangeQuestion}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					growVertically
					fill
					autoFocus
					className={classes.textareaElement({ question: true })}
				/>
			) : (
				<Button
					minimal
					fill
					large
					alignText={Alignment.LEFT}
					onClick={toggleExpanded}
					text={question}
					className={classes.questionElement()}
					intent={intent}
					onContextMenu={onContextMenu}
				/>
			)}
			<Collapse isOpen={isExpanded} keepChildrenMounted>
				<TextArea
					large
					inputRef={(ref) => (answerRef.current = ref)}
					value={answer}
					onChange={onChangeAnswer}
					onKeyDown={onKeyDown}
					growVertically
					fill
					placeholder='Answer'
					className={classes.textareaElement({ answer: true })}
				/>
			</Collapse>
		</div>
	);
};
