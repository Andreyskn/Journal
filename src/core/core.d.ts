import Immutable from 'immutable';
import { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import { Dispatch as ReactDispatch } from 'react';
import { CoreDispatch as CoreDispatchImpl } from './store';

declare global {
	namespace Actions {
		type AnyAction = App.ActionBase<any, any>;

		type AppAction = TabsAction | FileSystemAction | PersistanceAction;

		type Dispatch<A extends AnyAction = AppAction> =
			| ReduxDispatch<A>
			| ReactDispatch<A>;

		type Dispatcher<
			T extends any[] = undefined[],
			A extends AnyAction = AppAction
		> = (deps: { dispatch: Dispatch<A> }) => (...args: T) => void;

		type DispatcherMap<T extends Record<string, Dispatcher<any[], any>>> = {
			[K in keyof T]: ReturnType<T[K]>;
		};

		type ExtractActions<T extends AnyObject> = {
			[K in keyof T]: App.ActionBase<K, Parameters<T[K]>[1]>;
		}[keyof T];
	}

	namespace App {
		type Store = ReduxStore<ImmutableAppState, Actions.AppAction>;

		type AppState = TabsState & FileSystemState & WindowsState;

		interface ImmutableAppState
			extends OmitType<App.ImmutableRecord<AppState>, 'updateIn'> {}

		type AppImmutableNonRecordKey = '';

		type ImmutableNonRecordKey =
			| AppImmutableNonRecordKey
			| TabsImmutableNonRecordKey
			| FileSystemStateImmutableNonRecordKey
			| WindowsImmutableNonRecordKey;

		type RecordTag = 'tab' | 'file' | 'active-file' | 'window';

		type TaggedRecord<O extends AnyObject, T extends RecordTag> = O & {
			_tag: T;
		};

		type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
			Omit<T, '_tag'>;

		type StateReviver = (
			tag: Maybe<RecordTag>,
			key: Maybe<ImmutableNonRecordKey>,
			value:
				| Immutable.Collection.Keyed<string, any>
				| Immutable.Collection.Indexed<any>
		) => AnyObject | undefined;

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

		type ActionHandlers = Record<
			string,
			(
				state: ImmutableAppState,
				action: ActionBase<any, AnyObject>
			) => ImmutableAppState
		>;

		type CoreDispatch = CoreDispatchImpl;
	}
}
