import Events from 'events';

type Mutation =
	| App.ActionBase<
			'FILE_CREATED',
			{ state: App.ImmutableAppState; file: App.ImmutableFile }
	  >
	| App.ActionBase<
			'FILE_DELETED',
			{ state: App.ImmutableAppState; file: App.ImmutableFile }
	  >
	| App.ActionBase<
			'FILE_UPDATED',
			{ state: App.ImmutableAppState; file: App.ImmutableFile }
	  >;

type ExtractListener<T extends App.ActionBase<any, any>> = {
	type: T['type'];
	act: (
		payload: T extends { payload: any } ? T['payload'] : undefined
	) => void;
};

type EventEmitter = {
	dispatch: (mutation: Mutation) => void;
	on: (mutation: ExtractListener<Mutation>) => EventEmitter;
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
