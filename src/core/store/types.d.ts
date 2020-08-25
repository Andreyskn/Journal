import Immutable from 'immutable';

declare global {
	namespace Actions {
		type AppAction = TasksAction | TabsAction | FileSystemAction;

		//@ts-expect-error
		type ExtractActions<T> = T extends any ? Parameters<T[1]>[1] : never;
	}

	namespace App {
		type AppState = TasksState & TabsState & FileSystemState;

		interface ImmutableAppState
			extends OmitType<
				App.ImmutableRecord<AppState>,
				'updateIn' | 'getIn'
			> {}

		type AppImmutableNonRecordKey = '';

		type ImmutableNonRecordKey =
			| AppImmutableNonRecordKey
			| TasksImmutableNonRecordKey
			| TabsImmutableNonRecordKey;

		type RecordTag =
			| 'task'
			| 'task-list'
			| 'tab'
			| 'folder'
			| 'file'
			| 'inode';

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

		type Handler<
			P extends AnyObject | undefined = undefined
		> = P extends undefined
			? (state: ImmutableAppState) => ImmutableAppState
			: (state: ImmutableAppState, payload: P) => ImmutableAppState;

		// type AnyHandlers = Record<string, Handler<any>>;
		type AnyActionHandlers = [string, Handler<any>][];

		// type Action<H extends AnyHandlers, T extends keyof H> = ActionBase<
		// 	T,
		// 	Parameters<H[T]>[1] extends { payload: any }
		// 		? Parameters<H[T]>[1]['payload']
		// 		: undefined
		// >;
	}
}
