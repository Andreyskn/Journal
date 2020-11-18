export * from './useSelector';
export * from './useDispatch';

export const initHooks: Store.HookInitializer = (store, handlers) => {
	const ctx = require.context('.', false, /use.*\.tsx?$/);
	ctx.keys().forEach((key) =>
		ctx<{ default: Store.HookInitializer }>(key).default(store, handlers)
	);
};
