import Immutable from 'immutable';
import { handlers } from './handlers';

type TabsKey = KeyOf<App.TabsState, 'tabs'>;

declare global {
	namespace Actions {
		type TabsAction = ExtractActions<typeof handlers[number]>;
	}

	namespace App {
		type Tab = {
			id: App.RegularFile['id'];
			name: App.RegularFile['name'];
			type: App.RegularFile['type'];
			path: Path;
		};
		type TaggedTab = TaggedRecord<Tab, 'tab'>;
		type ImmutableTab = ImmutableRecord<TaggedTab>;

		type TabsState = {
			tabs: Immutable.OrderedMap<App.Tab['id'], ImmutableTab>;
		};

		type TabsImmutableNonRecordKey = TabsKey;
	}
}
