import Immutable, { isIndexed } from 'immutable';
import { get, set } from 'idb-keyval';

import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { actionHandler } from '../utils';

const createAppState = Immutable.Record<App.AppState>({
	...fileSystem.state,
	...tabs.state,
});

const rootReviver: App.StateReviver = (tag, key, value) => {
	return key === '' ? createAppState(value) : value.toJS();
};

const reviveState = (savedState: App.AppState): App.ImmutableAppState => {
	return Immutable.fromJS(savedState, (key, value) => {
		if (isIndexed(value)) return value.toList();

		const tag: Maybe<App.RecordTag> = value.get('_tag');

		for (let reviver of [fileSystem.reviver, tabs.reviver, rootReviver]) {
			const result = reviver(tag, key as any, value);
			if (result) return result;
		}
	});
};

export const getInitialState = () => {
	return createAppState();
};

export const initPersistance = (store: App.Store) => {
	get<App.AppState>('state')
		.then((savedState) => {
			store.dispatch({
				type: '@persistance/HYDRATE_STORE',
				payload: { savedState },
			});
		})
		.finally(() => {
			store.subscribe(() => {
				(<any>window).requestIdleCallback(() => {
					set('state', store.getState().toJS());
				});
			});
		});
};

const hydrateStore: App.Handler<{ savedState?: App.AppState }> = (
	state,
	{ savedState }
) => (savedState ? reviveState(savedState) : state);

export const persistanceHandlers = [
	actionHandler('@persistance/HYDRATE_STORE', hydrateStore),
];

declare global {
	namespace Actions {
		type PersistanceAction = ExtractActions<
			typeof persistanceHandlers[number]
		>;
	}
}
