import Immutable from 'immutable';

type TabsListKey = KeyOf<TabsState, 'tabsList'>;
type ActiveTabKey = KeyOf<TabsState, 'activeTabId'>;

type Tab_Id_String = Stringified<Tab['id']>;

declare global {
	type Tab = {
		id: number;
		contentType: KeyOf<TasksState, 'taskLists'>;
		contentId: number;
	};

	type TypedTab = TypedRecord<Tab, 'tab'>;

	type ImmutableTab = Immutable.Record<TypedTab>;

	type TabsState = {
		tabsList: Immutable.OrderedMap<Tab_Id_String, ImmutableTab>;
		activeTabId: number;
	};

	type TypedTabsState = TypedRecord<TabsState, 'tabs-state'>;

	type Tabs_Immutable_Non_Record_Key = TabsListKey;

	interface ImmutableTabsState
		extends OmitType<Immutable.Record<TypedTabsState>, 'updateIn'> {
		updateIn(
			keyPath: [TabsListKey],
			updater: Updater<TabsState['tabsList']>
		): ImmutableAppState;
	}
}
