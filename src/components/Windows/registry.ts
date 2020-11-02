export const windowRegistry = new Map<
	App.WindowModule['id'],
	App.WindowModule
>();

const register = (windowModule: App.WindowModule) => {
	windowRegistry.set(windowModule.id, windowModule);
};

const ctx = require.context('./modules');
ctx.keys().forEach((key) => register(ctx<App.WindowModule>(key)));

if (process.env.NODE_ENV === 'development') {
	register(require('../../utils/DevTools'));
}
