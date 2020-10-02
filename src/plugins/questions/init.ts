export { Questionary as Component } from './components/Questionary';
export { dispatchers } from './dispatcher';
export { handlers } from './handlers';

export const init: Plugin.Initializer<Questions.State> = (s) => {
	return s || { items: [] };
};
