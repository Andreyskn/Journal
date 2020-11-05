import Events from 'events';

export type Mutations = {
	FILE_CREATED: { state: App.ImmutableAppState; file: App.ImmutableFile };
	FILE_DELETED: { state: App.ImmutableAppState; file: App.ImmutableFile };
	FILE_UPDATED: { state: App.ImmutableAppState; file: App.ImmutableFile };
	FILE_SELECTED: { state: App.ImmutableAppState; file: App.ImmutableFile };
	SET_ACTIVE_FILE: { state: App.ImmutableAppState; id: App.ActiveFileId };
};

type Event = {
	[T in keyof Mutations]: App.ActionBase<T, Mutations[T]>;
}[keyof Mutations];

type Listener = {
	[T in keyof Mutations]: {
		type: T;
		act: (payload: Mutations[T]) => void;
	};
}[keyof Mutations];

type EventEmitter = {
	dispatch: (event: Event) => void;
	on: (listener: Listener) => EventEmitter;
};

const eventEmitter = new Events.EventEmitter();

export const mutations: EventEmitter = {
	dispatch: ({ type, payload }) => {
		eventEmitter.emit(type, payload);
	},
	on: ({ type, act }) => {
		eventEmitter.on(type, act);
		return mutations;
	},
};
