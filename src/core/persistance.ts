import Immutable, { isIndexed } from 'immutable';
import { get, set } from 'idb-keyval';

import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { windows } from './windows';

const createAppState = Immutable.Record<App.AppState>({
	...fileSystem.state,
	...tabs.state,
	...windows.state,
});

const rootReviver: App.StateReviver = (tag, key, value) => {
	return key === '' ? createAppState(value) : value.toJS();
};

const reviveState = (savedState: App.AppState): App.ImmutableAppState => {
	return Immutable.fromJS(savedState, (key, value) => {
		if (isIndexed(value)) return value.toList();

		const tag: Maybe<App.RecordTag> = value.get('_tag');

		for (let reviver of [
			fileSystem.reviver,
			tabs.reviver,
			windows.reviver,
			rootReviver,
		]) {
			const result = reviver(tag, key as any, value);
			if (result) return result;
		}
	});
};

export const getInitialState = () => {
	return createAppState();
};

export const initPersistance = (store: App.Store) => {
	get<Maybe<App.AppState>>('state')
		.then((savedState) => {
			if (!savedState) return;
			store.dispatch({
				type: '@persistance/hydrateStore',
				payload: { savedState },
			});
		})
		.finally(() => {
			let hasScheduledSave = false;
			store.subscribe(() => {
				if (hasScheduledSave) return;
				hasScheduledSave = true;
				(<any>window).requestIdleCallback(() => {
					set('state', store.getState().toJS());
					hasScheduledSave = false;
				});
			});
		});
};

const hydrateStore: App.Handler<{ savedState?: App.AppState }> = (
	state,
	{ savedState }
) => (savedState ? reviveState(savedState) : state);

export const persistanceHandlers = {
	'@persistance/hydrateStore': hydrateStore,
};

declare global {
	namespace Actions {
		type PersistanceAction = ExtractActions<typeof persistanceHandlers>;
	}
}
