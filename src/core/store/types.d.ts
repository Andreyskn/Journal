import Immutable from 'immutable';
import { Dispatch, Store as ReduxStore } from 'redux';

declare global {
	namespace Actions {
		type AppAction =
			| PersistanceAction
			| TasksAction
			| TabsAction
			| FileSystemAction;

		type Dispatcher<T extends any[] = any[], D extends AnyObject = {}> = (
			deps: D & {
				dispatch: Dispatch<Actions.AppAction>;
			}
		) => (...args: T) => void;

		type DispatcherMap<
			T extends Record<string, Actions.Dispatcher<any[], any>>
		> = {
			[K in keyof T]: ReturnType<T[K]>;
		};

		//@ts-expect-error
		type ExtractActions<T> = T extends any ? Parameters<T[1]>[1] : never;
	}

	namespace App {
		type Store = ReduxStore<ImmutableAppState, Actions.AppAction>;

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
			| TabsImmutableNonRecordKey
			| FileSystemStateImmutableNonRecordKey;

		type RecordTag = 'task' | 'task-list' | 'tab' | 'file';

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
