import Immutable from 'immutable';

type TabsListKey = KeyOf<TabsState, 'tabsList'>;

declare global {
	type Tab = {
		id: string;
		contentPath: Concat<RootPath['toTasks'], TasksPath['toTaskList']>;
	};

	type TypedTab = TypedRecord<Tab, 'tab'>;

	type ImmutableTab = ImmutableRecord<TypedTab>;

	type TabsState = {
		tabsList: Immutable.OrderedMap<Tab['id'], ImmutableTab>;
		activeTabId: Tab['id'];
	};

	type TypedTabsState = TypedRecord<TabsState, 'tabs-state'>;

	type Tabs_Immutable_Non_Record_Key = TabsListKey;

	interface TabsPath {
		toTabsList: [TabsListKey];
		toActiveTabId: [KeyOf<TabsState, 'activeTabId'>];
		toTab: [TabsListKey, Tab['id']];
	}

	interface ImmutableTabsState
		extends OmitType<ImmutableRecord<TypedTabsState>, 'updateIn'> {
		updateIn(
			keyPath: TabsPath['toTabsList'],
			updater: Updater<TabsState['tabsList']>
		): ImmutableTabsState;
	}
}
