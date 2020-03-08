import { Record, OrderedMap } from 'immutable';

type TabsKey = KeyOf<TabsState, 'tabs'>;
type ActiveTabKey = KeyOf<TabsState, 'activeTabId'>;

declare global {
	type Tab = {
		id: number;
		contentType: KeyOf<AppState, 'taskLists'>;
		contentId: number;
	};

	type ImmutableTab = Record<Tab>;

	type TabsState = {
		tabs: OrderedMap<Tab['id'], ImmutableTab>;
		activeTabId: number;
	};

	interface ImmutableAppState {
		updateIn(
			keyPath: [TabsKey],
			updater: Updater<TabsState['tabs']>
		): ImmutableAppState;
	}
}
