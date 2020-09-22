import { actionHandler } from '../../utils';

type QuestionsHandler<P extends AnyObject | undefined = undefined> = App.Handler<
	P,
	App.Questions
>;

const example: QuestionsHandler<{
	example: string;
}> = (state, { example }) => {
	return { ...state, example };
};

export const handlers = [actionHandler('@questions/EXAMPLE', example)];