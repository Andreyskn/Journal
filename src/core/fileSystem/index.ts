import { handlers } from './handlers';
import { state, reviver } from './initialState';

export const fileSystem = {
	handlers,
	state,
	reviver,
};
export * from './constants';

// TODO: export * as fs from './helpers';
import * as fs from './helpers';
export { fs };
