import Immutable from 'immutable';
import { ThunkDispatch } from 'redux-thunk';

declare global {
	type AppState = {
		tasks: TasksState;
		tabs: TabsState;
	};

	interface RootPath {
		toTasks: [KeyOf<AppState, 'tasks'>];
		toTabs: [KeyOf<AppState, 'tabs'>];
	}

	type AppAction = TaskAction | TabAction;

	type ImmutableAppState = ImmutableRecord<AppState>;

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
		| 'tabs-state';

	type TypedRecord<O extends AnyObject, T extends RecordType> = O & {
		_type: T;
	};

	type ImmutableRecord<T extends AnyObject> = Immutable.Record<T> &
		Omit<T, '_type'>;

	type Reducer<S, A extends AppAction> = (state: S, action: A) => S;

	type Updater<T> = (data: T) => T;

	type Action<T extends string | number, P = undefined> = P extends undefined
		? { type: T }
		: { type: T; payload: P };

	type ThunkAction = (
		dispatch: ThunkDispatch<ImmutableAppState, undefined, AppAction>,
		getState: () => ImmutableAppState
	) => void;
}
