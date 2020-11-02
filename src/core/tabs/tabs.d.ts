import Immutable from 'immutable';
import { handlers } from './handlers';

type TabsKey = KeyOf<App.TabsState, 'tabs'>;

declare global {
	namespace Actions {
		type TabsAction = ExtractActions<typeof handlers>;
	}

	namespace App {
		type Tab = {
			id: RegularFile['id'];
			name: RegularFile['name'];
			type: RegularFile['type'];
			path: Path;
		};
		type TaggedTab = TaggedRecord<Tab, 'tab'>;
		type ImmutableTab = ImmutableRecord<TaggedTab>;

		type TabsState = {
			tabs: Immutable.OrderedMap<Tab['id'], ImmutableTab>;
		};

		type TabsImmutableNonRecordKey = TabsKey;
	}
}
