import Immutable from 'immutable';

declare global {
	type AppState = {
		tasks: TasksState;
		tabs: TabsState;
	};

	type AppAction = TaskAction | TabAction;

	type ImmutableAppState = Immutable.Record<AppState>;

	type App_State_Immutable_Non_Record_Key = '';

	type Immutable_Non_Record_Key =
		| App_State_Immutable_Non_Record_Key
		| Tasks_Immutable_Non_Record_Key
		| Tabs_Immutable_Non_Record_Key;
}
