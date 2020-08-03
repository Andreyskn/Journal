import Immutable from 'immutable';

type TabsKey = KeyOf<Store.TabsState, 'tabs'>;

declare global {
	namespace Store {
		type Tab = {
			filePath: Path;
		};
		type TaggedTab = TaggedRecord<Tab, 'tab'>;
		type ImmutableTab = ImmutableRecord<TaggedTab>;

		type TabsState = {
			tabs: Immutable.List<ImmutableTab>;
		};

		type TabsImmutableNonRecordKey = TabsKey;

		interface PathTo {
			tabs: [TabsKey];
		}
	}
}
