import Immutable, { isKeyed } from 'immutable';
import { get, set } from 'idb-keyval';

import { getSystemActionType } from '../utils';
import { fileSystem } from './fileSystem';
import { tabs } from './tabs';
import { windows } from './windows';

type PlainState = ReturnType<Store.State['toJS']>;

const createAppState = Immutable.Record<PlainState>({
	...fileSystem.state,
	...tabs.state,
	...windows.state,
});

const rootReviver: Store.Reviver = (tag, key, value) => {
	return key === '' ? createAppState(value) : value.toJS();
};

const reviveState = (savedState: PlainState): Store.State => {
	return Immutable.fromJS(savedState, (key, value) => {
		const tag: Maybe<Store.RecordTag> =
			isKeyed(value) &&
			(value as Immutable.Collection.Keyed<
				keyof TaggedObject<{}, any>,
				any
			>).get('__tag');

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

export const initPersistance = (store: Store.Store) => {
	get<Maybe<PlainState>>('state')
		.then((savedState) => {
			if (!savedState) return;
			store.dispatch({
				type: '@system/hydrateStore',
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

const hydrateStore: Actions.Handler<{ savedState: PlainState }> = (
	state,
	{ savedState }
) => reviveState(savedState);

export const persistanceHandlers = {
	[getSystemActionType('hydrateStore')]: hydrateStore,
};

declare global {
	namespace Store {
		interface HandlersRegistry {
			Persistance: typeof persistanceHandlers;
		}
	}
}
