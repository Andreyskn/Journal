import Immutable from 'immutable';

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

		type RecordTag = 'task' | 'task-list' | 'tab' | 'folder' | 'file';
	}

	type TaggedRecord<O extends AnyObject, T extends Model.RecordTag> = O & {
		_tag: T;
	};

	type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
		Omit<T, '_tag'>;

	type Reducer<S, A extends Model.AppAction> = (state: S, action: A) => S;

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
		state: Model.ImmutableAppState,
		action: ActionBase<string, P>
	) => Model.ImmutableAppState;

	type AnyHandlers = Record<string, Handler<any>>;

	type Action<H extends AnyHandlers, T extends keyof H> = ActionBase<
		T,
		Parameters<H[T]>[1] extends { payload: any }
			? Parameters<H[T]>[1]['payload']
			: undefined
	>;
}
