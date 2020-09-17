import Immutable from 'immutable';
import { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

declare global {
	namespace Actions {
		type AnyAction = App.ActionBase<string | number | symbol, any>;

		type AppAction = (
			| TabsAction
			| FileSystemAction
			| PluginAction
			| PersistanceAction
		) &
			Meta;

		type Meta = Partial<{
			scope: string[];
		}>;

		type Dispatch = ReduxDispatch<AppAction>;

		type Dispatcher<T extends any[] = any[], D extends AnyObject = {}> = (
			deps: D & {
				dispatch: Dispatch;
			}
		) => (...args: T) => void;

		type DispatcherDeps<
			T extends Record<string, Actions.Dispatcher<any[], any>>,
			R extends AnyObject = OmitType<
				Parameters<T[keyof T]>[0],
				'dispatch'
			>
		> = keyof R extends never ? never : R;

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

		type AppState = TabsState & FileSystemState;

		interface ImmutableAppState
			extends OmitType<App.ImmutableRecord<AppState>, 'updateIn'> {}

		type AppImmutableNonRecordKey = '';

		type ImmutableNonRecordKey =
			| AppImmutableNonRecordKey
			| TabsImmutableNonRecordKey
			| FileSystemStateImmutableNonRecordKey;

		type RecordTag = 'tab' | 'file';

		type TaggedRecord<O extends AnyObject, T extends RecordTag> = O & {
			_tag: T;
		};

		type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
			Omit<T, '_tag'>;

		type StateReviver = (
			tag: Maybe<RecordTag>,
			key: Maybe<ImmutableNonRecordKey>,
			value: Immutable.Collection.Keyed<string, any>
		) => AnyObject | undefined;

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
			P extends AnyObject | undefined = undefined,
			S extends AnyObject = ImmutableAppState
		> = P extends undefined ? (state: S) => S : (state: S, payload: P) => S;

		type ActionHandlers<
			S extends AnyObject = ImmutableAppState,
			P extends AnyObject | undefined = any
		> = [string, Handler<P, S>][];
	}
}
