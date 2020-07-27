import Immutable from 'immutable';
import { ThunkDispatch as ReduxThunkDispatch } from 'redux-thunk';

declare global {
	namespace Model {
		type AppState = TasksState & TabsState & FileSystemState;

		type AppAction = TaskAction | TabAction | FileSystemAction;

		interface ImmutableAppState
			extends OmitType<ImmutableRecord<AppState>, 'updateIn' | 'getIn'> {}

		type App_Immutable_Non_Record_Key = '';

		type Immutable_Non_Record_Key =
			| App_Immutable_Non_Record_Key
			| Tasks_Immutable_Non_Record_Key
			| Tabs_Immutable_Non_Record_Key;

		type RecordType = 'task' | 'task-list' | 'tab' | 'folder' | 'file';
	}

	type TaggedRecord<O extends AnyObject, T extends Model.RecordType> = O & {
		_tag: T;
	};

	type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
		Omit<T, '_tag'>;

	type Reducer<S, A extends Model.AppAction> = (state: S, action: A) => S;

	type Updater<T> = (data: T) => T;

	type ActionBase<T extends string | number | symbol, P = undefined> = {
		type: T;
		payload: P;
	};

	type Handler<P = undefined> = (
		state: Model.ImmutableAppState,
		action: ActionBase<string, P>
	) => Model.ImmutableAppState;

	type AnyHandlers = Record<string, Handler<any>>;

	type Action<H extends AnyHandlers, T extends keyof H> = ActionBase<
		T,
		Parameters<H[T]>[1]['payload']
	>;

	type ThunkDispatch<
		A extends Model.AppAction = Model.AppAction
	> = ReduxThunkDispatch<Model.ImmutableAppState, undefined, A>;

	type ThunkAction = (
		dispatch: ThunkDispatch,
		getState: () => Model.ImmutableAppState
	) => void;

	type Thunks = Record<string, AnyFunction>;
}
