import Immutable from 'immutable';
import { ThunkDispatch as ReduxThunkDispatch } from 'redux-thunk';

declare global {
	type AppState = TasksState & TabsState;

	type AppAction = TaskAction | TabAction;

	interface ImmutableAppState
		extends OmitType<ImmutableRecord<AppState>, 'updateIn'> {}

	type App_Immutable_Non_Record_Key = '';

	type Immutable_Non_Record_Key =
		| App_Immutable_Non_Record_Key
		| Tasks_Immutable_Non_Record_Key
		| Tabs_Immutable_Non_Record_Key;

	type RecordType =
		| 'task'
		| 'task-list'
		| 'tab'
		| 'tasks-state'
		| 'tabs-state'
		| 'active-document';

	type TypedRecord<O extends AnyObject, T extends RecordType> = O & {
		_type: T;
	};

	type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
		Omit<T, '_type'>;

	type Reducer<S, A extends AppAction> = (state: S, action: A) => S;

	type Updater<T> = (data: T) => T;

	type ActionBase<T extends string | number | symbol, P = undefined> = {
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
		Parameters<H[T]>[1]['payload']
	>;

	type ThunkDispatch<A extends AppAction = AppAction> = ReduxThunkDispatch<
		ImmutableAppState,
		undefined,
		A
	>;

	type ThunkAction = (
		dispatch: ThunkDispatch,
		getState: () => ImmutableAppState
	) => void;

	type Thunks = Record<string, AnyFunction>;
}
