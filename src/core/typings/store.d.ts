import Immutable from 'immutable';
import { Store as ReduxStore } from 'redux';

declare global {
	namespace Store {
		interface Registry {
			App: SetCorePart<{}, {}, ''>;
		}

		type SetCorePart<
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
			Registry[keyof Registry]['taggedRecords']
		>;

		type ImmutableRecord<T extends AnyObject> = Immutable.Record<
			T & Partial<TaggedObject<{}, any>>
		> &
			T;

		type RecordTag = TaggedRecords[keyof TaggedRecords]['__tag'];

		type Handlers = UnionToIntersection<
			Registry[keyof Registry]['handlers']
		>;

		type Action = Actions.ExtractActions<Handlers>;

		type Dispatch = Actions.Dispatch<Handlers>;

		type Store = ReduxStore<State, Action>;

		interface State
			extends OmitType<
				ImmutableRecord<
					UnionToIntersection<
						Store.Registry[keyof Store.Registry]['state']
					>
				>,
				'updateIn' | 'getIn' | 'setIn'
			> {}

		type Reviver = (
			tag: Maybe<RecordTag>,
			key: Maybe<Registry[keyof Registry]['reviverKey']>,
			value:
				| Immutable.Collection.Keyed<string, any>
				| Immutable.Collection.Indexed<any>
		) => AnyObject | undefined;
	}
}
