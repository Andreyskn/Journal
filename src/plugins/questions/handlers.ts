import { generateId } from '../../utils';

const addQuestion: Questions.Handler<{
	question: Questions.QABlock['question'];
}> = (state, { question }) => {
	const qaBlock: Questions.QABlock = {
		id: generateId(),
		question,
		answer: '',
	};

	return {
		...state,
		items: [qaBlock, ...state.items],
	};
};

export const handlers = {
	ADD_QUESTION: addQuestion,
};
