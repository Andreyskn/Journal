import Immutable from 'immutable';
import { generateId } from '../../utils';
import { defaultTaskListId } from '../tasks';

export const defaultTabId = generateId();

export const ActiveDocumentRecord = Immutable.Record<TypedActiveDocument>({
	_type: 'active-document',
	contentId: defaultTaskListId,
	// contentType: 'tasks',
	// tabId: defaultTabId,
});

export const activeDocumentReducer: Reducer<
	ImmutableActiveDocument,
	ActiveDocumentAction
> = (activeDocumentState, action) => {
	switch (action.type) {
		case '@active/SET': {
			return activeDocumentState.set('contentId', action.payload);
		}

		default:
			return activeDocumentState;
	}
};
