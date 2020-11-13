import './questionary.scss';

import { bem } from '../../../utils';
import { QAItem } from './QAItem';

type QuestionaryProps = Plugin.ComponentProps<
	Questions.State,
	Questions.Dispatch
>;

const classes = bem('questionary', ['form', 'input'] as const);

export const Questionary: React.FC<QuestionaryProps> = ({
	state: questionary,
	dispatch,
}) => {
	return (
		<div className={classes.questionaryBlock()}>
			{questionary.items.map((qaBlock) => (
				<QAItem {...qaBlock} dispatch={dispatch} key={qaBlock.id} />
			))}
		</div>
	);
};
