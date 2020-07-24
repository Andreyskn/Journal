import Immutable from 'immutable';
import { ThunkDispatch as ReduxThunkDispatch } from 'redux-thunk';

declare global {
	type AppState = {
		tasks: TasksState;
		tabs: TabsState;
		activeDocument: ActiveDocument;
	};

	interface RootPath {
		toTasks: [KeyOf<AppState, 'tasks'>];
		toTabs: [KeyOf<AppState, 'tabs'>];
		toActiveDocument: [KeyOf<AppState, 'activeDocument'>];
	}

	type AppAction = TaskAction | TabAction | SetActiveDocument;

	interface ImmutableAppState
		extends OmitType<ImmutableRecord<AppState>, 'getIn'> {
		getIn(
			path: Concat<RootPath['toTasks'], TasksPath['toTaskList']>
		): ImmutableTaskList;
		getIn(
			path: Concat<RootPath['toTasks'], TasksPath['toTaskLists']>
		): TasksState['taskLists'];
	}

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

	type Action<T extends string | number, P = undefined> = P extends undefined
		? { type: T }
		: { type: T; payload: P };

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
