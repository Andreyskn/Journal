const addQuestion: Questions.Dispatcher<[
	question: Questions.QABlock['question']
]> = ({ dispatch }) => (question) => {
	dispatch({
		type: 'ADD_QUESTION',
		payload: { question },
	});
};

export const dispatchers = {
	addQuestion,
};
