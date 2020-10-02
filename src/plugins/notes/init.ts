export { NoteEditor as Component } from './components/NoteEditor';
export { dispatchers } from './dispatcher';
export { handlers } from './handlers';

export const init: Plugin.Initializer<Notes.State> = (s) => {
	return s || { text: '' };
};
