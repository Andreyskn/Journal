import Immutable from 'immutable';

type TabsKey = KeyOf<TabsState, 'tabs'>;
type ActiveTabKey = KeyOf<TabsState, 'activeTabId'>;

declare global {
	type Tab = {
		id: number;
		contentType: KeyOf<AppState, 'taskLists'>;
		contentId: number;
	};

	type TypedTab = TypedObject<Tab, 'tab'>;

	type ImmutableTab = Immutable.Record<TypedTab>;

	type TabsState = {
		tabs: Immutable.OrderedMap<Stringified<Tab['id']>, ImmutableTab>;
		activeTabId: number;
	};

	interface ImmutableAppState {
		updateIn(
			keyPath: [TabsKey],
			updater: Updater<TabsState['tabs']>
		): ImmutableAppState;
	}
}
