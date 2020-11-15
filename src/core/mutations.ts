import Events from 'events';

type Mutations = {
	FILE_CREATED: { state: Store.State; file: Store.File };
	FILE_DELETED: { state: Store.State; file: Store.File };
	FILE_UPDATED: { state: Store.State; file: Store.File };
	FILE_SELECTED: { state: Store.State; file: Store.File };
	SET_ACTIVE_FILE: { state: Store.State; id: Store.ActiveFileId };
};

type Event = {
	[T in keyof Mutations]: Actions.ActionBase<T, Mutations[T]>;
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
	once: (listener: Listener) => EventEmitter;
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
	once: ({ type, act }) => {
		eventEmitter.once(type, act);
		return mutations;
	},
};
