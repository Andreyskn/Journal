import Immutable from 'immutable';

type TabsListKey = KeyOf<TabsState, 'tabsList'>;

declare global {
	type Tab = {
		id: string;
		contentType: 'tasks';
		contentPath: TasksPath['toTaskList'];
	};

	type TypedTab = TypedRecord<Tab, 'tab'>;

	type ImmutableTab = ImmutableRecord<TypedTab>;

	type TabsState = {
		tabsList: Immutable.OrderedMap<Tab['id'], ImmutableTab>;
		activeTabId: Tab['id'];
	};

	type Tabs_Immutable_Non_Record_Key = TabsListKey;

	interface TabsPath {
		toTabsList: [TabsListKey];
		toActiveTabId: [KeyOf<TabsState, 'activeTabId'>];
		toTab: [TabsListKey, Tab['id']];
	}

	interface ImmutableAppState {
		updateIn(
			keyPath: TabsPath['toTabsList'],
			updater: Updater<TabsState['tabsList']>
		): ImmutableAppState;
	}
}
