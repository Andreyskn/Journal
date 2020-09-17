import { handlers } from './handlers';
import { state, reviver } from './initialState';

export const tabs = {
	handlers,
	state,
	reviver,
};
export { createTab } from './helpers';
