import { generateId } from '../../utils';

const addQuestion: Questions.Handler<{
	question: Questions.QABlock['question'];
}> = (state, { question }) => {
	const qaBlock: Questions.QABlock = {
		id: generateId(),
		question,
		answer: '',
		isExpanded: true,
	};

	return {
		...state,
		items: [qaBlock, ...state.items],
	};
};

const setAnswer: Questions.Handler<{
	id: Questions.QABlock['id'];
	answer: Questions.QABlock['answer'];
}> = (state, { id, answer }) => {
	return {
		...state,
		items: state.items.map((item) =>
			item.id === id ? { ...item, answer } : item
		),
	};
};

const setQuestion: Questions.Handler<{
	id: Questions.QABlock['id'];
	question: Questions.QABlock['question'];
}> = (state, { id, question }) => {
	return {
		...state,
		items: state.items.map((item) =>
			item.id === id ? { ...item, question } : item
		),
	};
};

const setExpanded: Questions.Handler<{
	id: Questions.QABlock['id'];
	isExpanded: boolean;
}> = (state, { id, isExpanded }) => {
	return {
		...state,
		items: state.items.map((item) =>
			item.id === id ? { ...item, isExpanded } : item
		),
	};
};

const deleteQuestion: Questions.Handler<{
	id: Questions.QABlock['id'];
}> = (state, { id }) => {
	return {
		...state,
		items: state.items.filter((item) => item.id !== id),
	};
};

export const handlers = {
	ADD_QUESTION: addQuestion,
	DELETE_QUESTION: deleteQuestion,
	SET_ANSWER: setAnswer,
	SET_QUESTION: setQuestion,
	SET_EXPANDED: setExpanded,
};
