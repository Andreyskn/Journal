import React from 'react';

import './questions.scss';

import { useBEM } from '../../../utils';
import { QuestionsDispatch } from '../dispatcher';

type QuestionsPluginProps = App.PluginComponentProps<
	App.Questions,
	QuestionsDispatch
>;

const [questionsBlock, questionsElement] = useBEM('questions');

export const QuestionsPlugin: React.FC<QuestionsPluginProps> = ({
	data: questions,
	dispatch,
}) => {
	return <div className={questionsBlock()}>Q & A</div>;
};
