import Immutable from 'immutable';

type TabsListKey = KeyOf<TabsState, 'tabsList'>;

declare global {
	type ActiveDocument = {
		contentId: TaskList['id'];
		// contentType: 'tasks';
		// tabId: Tab['id'];
	};

	type TypedActiveDocument = TypedRecord<ActiveDocument, 'active-document'>;

	type ImmutableActiveDocument = ImmutableRecord<TypedActiveDocument>;

	// interface ImmutableTabsState
	// 	extends OmitType<ImmutableRecord<TypedTabsState>, 'updateIn'> {
	// 	updateIn(
	// 		keyPath: TabsPath['toTabsList'],
	// 		updater: Updater<TabsState['tabsList']>
	// 	): ImmutableTabsState;
	// }
}
