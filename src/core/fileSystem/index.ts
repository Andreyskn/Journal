import { handlers } from './handlers';
import { state, reviver } from './initialState';

export const fileSystem = {
	handlers,
	state,
	reviver,
};
export * from './constants';
export {
	getFilePath,
	getFilePathById,
	createFileRecord,
	isRegularFile,
} from './helpers';
