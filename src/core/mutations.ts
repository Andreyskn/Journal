import Events from 'events';

type CreateData = App.ActionBase<
	'CREATE_DATA_ENTRY',
	{ state: App.ImmutableAppState; type: App.RegularFile['type'] }
>;
type FileCreated = App.ActionBase<
	'FILE_CREATED',
	{ state: App.ImmutableAppState; file: App.ImmutableFile }
>;

type Mutation = CreateData | FileCreated;

type ExtractListener<
	T extends App.ActionBase<any, any>
> = T extends App.ActionBase<any, any>
	? {
			type: T['type'];
			act: (
				payload: T extends { payload: any } ? T['payload'] : undefined
			) => void;
	  }
	: never;

type EventEmitter = {
	dispatch: (mutation: Mutation) => void;
	on: (mutation: ExtractListener<Mutation>) => void;
};

const eventEmitter = new Events.EventEmitter();

export const mutations: EventEmitter = {
	dispatch: ({ type, payload }) => {
		eventEmitter.emit(type, payload);
	},
	on: ({ type, act }) => eventEmitter.on(type, act),
};
