import { render as renderImpl } from './components';
import { handlers as handlersImpl } from './handlers';

const QA_RE = /# (.*)\n> (.*)/;

const defaultState: Readonly<Questions.State> = { items: [] };

const init: Plugin.Initializer<Questions.State> = (state) => {
	if (typeof state === 'string') {
		const rawQA: string[][] = [];

		state.split(/\n{2,}/).forEach((line) => {
			const match = QA_RE.exec(line);
			if (match) {
				rawQA.push([match[1], match[2]]);
			}
		});

		return rawQA.reduceRight((state, [question, answer]) => {
			const stateWithQuestion = handlersImpl.addQuestion(state, {
				question,
			});

			return handlersImpl.setAnswer(stateWithQuestion, {
				answer,
				id: stateWithQuestion.items[0].id,
			});
		}, defaultState);
	}

	return state || defaultState;
};

const lazyModule: Plugin.LazyModule = {
	render: renderImpl,
	handlers: handlersImpl,
	initState: init,
};

export const { render, handlers, initState } = lazyModule;
