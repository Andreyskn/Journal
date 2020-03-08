import { Record, OrderedMap } from 'immutable';

declare global {
	type AppState = TasksState & TabsState;

	interface ImmutableAppState
		extends OmitType<Record<AppState>, 'updateIn'> {}
}
