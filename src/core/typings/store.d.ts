import Immutable from 'immutable';
import { Store as ReduxStore } from 'redux';

declare global {
	namespace Store {
		interface SliceRegistry {}
		interface HandlersRegistry {}

		type SetSlice<
			S extends AnyObject,
			H extends Actions.HandlersMap,
			REV extends keyof any,
			REC extends Record<string, TaggedObject<AnyObject, any>> = {}
		> = {
			state: S;
			handlers: H;
			reviverKey: REV;
			taggedRecords: REC;
		};

		type TaggedRecords = UnionToIntersection<
			SliceRegistry[keyof SliceRegistry]['taggedRecords']
		>;

		type ImmutableRecord<T extends AnyObject> = Immutable.Record<
			T & Partial<TaggedObject<{}, any>>
		> &
			T;

		type RecordTag = TaggedRecords[keyof TaggedRecords]['__tag'];

		type Handlers = UnionToIntersection<
			| SliceRegistry[keyof SliceRegistry]['handlers']
			| HandlersRegistry[keyof HandlersRegistry]
		>;

		type Action = Actions.ExtractActions<Handlers>;

		type Dispatch = Actions.Dispatch<Handlers>;

		type Store = ReduxStore<State, Action>;

		type HookInitializer = (store: Store, handlers: Handlers) => void;

		interface State
			extends OmitType<
				ImmutableRecord<
					UnionToIntersection<
						Store.SliceRegistry[keyof Store.SliceRegistry]['state']
					>
				>,
				'updateIn' | 'getIn' | 'setIn'
			> {}

		type Reviver = (
			tag: Maybe<RecordTag>,
			key: Maybe<SliceRegistry[keyof SliceRegistry]['reviverKey'] | ''>,
			value:
				| Immutable.Collection.Keyed<string, any>
				| Immutable.Collection.Indexed<any>
		) => AnyObject | undefined;
	}
}
