const addQuestion: Questions.Dispatcher<[
	question: Questions.QABlock['question']
]> = ({ dispatch }) => (question) => {
	dispatch({
		type: 'ADD_QUESTION',
		payload: { question },
	});
};

const setAnswer: Questions.Dispatcher<[
	id: Questions.QABlock['id'],
	answer: Questions.QABlock['answer']
]> = ({ dispatch }) => (id, answer) => {
	dispatch({
		type: 'SET_ANSWER',
		payload: { id, answer },
	});
};

const setQuestion: Questions.Dispatcher<[
	id: Questions.QABlock['id'],
	question: Questions.QABlock['question']
]> = ({ dispatch }) => (id, question) => {
	dispatch({
		type: 'SET_QUESTION',
		payload: { id, question },
	});
};

const deleteQuestion: Questions.Dispatcher<[id: Questions.QABlock['id']]> = ({
	dispatch,
}) => (id) => {
	dispatch({
		type: 'DELETE_QUESTION',
		payload: { id },
	});
};

const setExpanded: Questions.Dispatcher<[
	id: Questions.QABlock['id'],
	isExpanded: boolean
]> = ({ dispatch }) => (id, isExpanded) => {
	dispatch({
		type: 'SET_EXPANDED',
		payload: { id, isExpanded },
	});
};

export const dispatchers = {
	addQuestion,
	setAnswer,
	setQuestion,
	deleteQuestion,
	setExpanded,
};
