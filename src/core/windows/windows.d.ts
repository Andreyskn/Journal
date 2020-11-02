import Immutable from 'immutable';

type WindowsKey = KeyOf<App.WindowsState, 'windows'>;

declare global {
	namespace Actions {}

	namespace App {
		type Window = {
			id: string;
			status: 'closed' | 'open' | 'minimized' | 'maximized';
			width: Pixels;
			height: Pixels;
			position: Position;
		};
		type TaggedWindow = TaggedRecord<Window, 'window'>;
		type ImmutableWindow = ImmutableRecord<TaggedWindow>;

		type WindowsState = {
			windows: Immutable.OrderedMap<Window['id'], ImmutableWindow>;
		};

		type WindowModule = {
			id: string;
			title: string;
			icon: IconType;
			Content: React.FC;
			menuEntry?: {
				order: number;
			};
		};

		type WindowsImmutableNonRecordKey = WindowsKey;
	}
}
