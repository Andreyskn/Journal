import Immutable from 'immutable';
import { handlers } from './handlers';

declare global {
	namespace Model {
		type Tab = {
			id: Model.RegularFile['id'];
			name: Model.RegularFile['name'];
			type: Model.RegularFile['type'];
			path: Path;
		};
	}

	namespace Store {
		type Tab = ImmutableRecord<Model.Tab>;

		type TabsState = {
			tabs: Immutable.OrderedMap<Tab['id'], Tab>;
		};

		interface Registry {
			Tabs: SetCorePart<
				TabsState,
				typeof handlers,
				keyof TabsState,
				{
					Tab: TaggedObject<Model.Tab, 'tab'>;
				}
			>;
		}
	}
}
