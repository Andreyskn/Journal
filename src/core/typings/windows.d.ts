import Immutable from 'immutable';
import { handlers } from '../windows/handlers';

declare global {
	namespace Model {
		type Window = {
			id: string;
			status: 'closed' | 'open' | 'minimized' | 'maximized';
			width: Pixels;
			height: Pixels;
			position: Position;
		};
	}

	namespace Store {
		type Window = ImmutableRecord<Model.Window>;

		type WindowsState = {
			windows: Immutable.Map<Window['id'], Window>;
			windowOrder: Immutable.OrderedSet<Window['id']>;
		};

		interface SliceRegistry {
			Windows: SetSlice<
				WindowsState,
				typeof handlers,
				keyof WindowsState,
				{
					Window: TaggedObject<Model.Window, 'window'>;
				}
			>;
		}
	}
}
