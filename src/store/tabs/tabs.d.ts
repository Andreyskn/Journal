import Immutable from 'immutable';

type TabsKey = KeyOf<Model.TabsState, 'tabs'>;

declare global {
	namespace Model {
		type Tab = {
			filePath: File['path']['absolute'];
		};
		type TaggedTab = TaggedRecord<Tab, 'tab'>;
		type ImmutableTab = ImmutableRecord<TaggedTab>;

		type TabsState = {
			tabs: Immutable.List<ImmutableTab>;
		};

		type Tabs_Immutable_Non_Record_Key = TabsKey;

		interface Path {
			toTabs: [TabsKey];
		}
	}
}
