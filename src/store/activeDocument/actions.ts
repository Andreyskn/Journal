declare global {
	type SetActiveDocument = Action<'@active/SET', ActiveDocument['contentId']>;

	type ActiveDocumentAction = SetActiveDocument;

	interface Dispatch {
		activeDocumentAction: typeof activeDocumentActions;
	}
}

export const activeDocumentActions = {
	setActiveDocument: (contentId: TaskList['id']): ThunkAction => (
		dispatch,
		getState
	) => {
		dispatch<SetActiveDocument>({
			type: '@active/SET',
			payload: contentId,
		});
	},
};
