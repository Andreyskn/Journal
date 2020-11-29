import Immutable from 'immutable';
import { handlers } from '../windows/handlers';

declare global {
	namespace Model {
		type WindowRect = {
			width: Pixels;
			height: Pixels;
			position: Position;
		};

		type Window = WindowRect & {
			id: Windows.Registry[keyof Windows.Registry]['id'];
			status: 'closed' | 'open' | 'minimized';
			isMaximized: boolean;
		};
	}

	namespace Store {
		type Window = ImmutableRecord<Model.Window>;

		type WindowsState = {
			windows: Immutable.Map<Window['id'], Window>;
			windowOrder: Immutable.OrderedSet<Window['id']>;
			// TODO: taskbar items order
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
