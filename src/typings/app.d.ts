import Immutable from 'immutable';

declare global {
	type AppState = TasksState & TabsState;

	interface ImmutableAppState
		extends OmitType<Immutable.Record<AppState>, 'updateIn'> {}
}
