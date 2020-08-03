import Immutable from 'immutable';

declare global {
	namespace Actions {
		type AppAction = TaskAction | TabAction | FileSystemAction;
	}

	namespace Store {
		type AppState = TasksState & TabsState & FileSystemState;

		interface ImmutableAppState
			extends OmitType<
				Store.ImmutableRecord<AppState>,
				'updateIn' | 'getIn'
			> {}

		type AppImmutableNonRecordKey = '';

		type ImmutableNonRecordKey =
			| AppImmutableNonRecordKey
			| TasksImmutableNonRecordKey
			| TabsImmutableNonRecordKey;

		type RecordTag = 'task' | 'task-list' | 'tab' | 'folder' | 'file';

		type TaggedRecord<O extends AnyObject, T extends RecordTag> = O & {
			_tag: T;
		};

		type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
			Omit<T, '_tag'>;

		type Reducer<S, A extends Actions.AppAction> = (
			state: S,
			action: A
		) => S;

		type Updater<T> = (data: T) => T;

		type ActionBase<
			T extends string | number | symbol,
			P = undefined
		> = P extends undefined
			? { type: T }
			: {
					type: T;
					payload: P;
			  };

		type Handler<P = undefined> = (
			state: ImmutableAppState,
			action: ActionBase<string, P>
		) => ImmutableAppState;

		type AnyHandlers = Record<string, Handler<any>>;

		type Action<H extends AnyHandlers, T extends keyof H> = ActionBase<
			T,
			Parameters<H[T]>[1] extends { payload: any }
				? Parameters<H[T]>[1]['payload']
				: undefined
		>;
	}
}
