declare global {
	type WindowModule = {
		id: string;
		title: string;
		icon: IconType;
		Content: React.FC;
		menuEntry?: {
			order: number;
			Label?: React.FC;
		};
	};
}

export const windowRegistry = new Map<WindowModule['id'], WindowModule>();

const register = (windowModule: WindowModule) => {
	windowRegistry.set(windowModule.id, windowModule);
};

const ctx = require.context('./modules', false, /\.tsx$/);
ctx.keys().forEach((key) => register(ctx<WindowModule>(key)));

if (process.env.NODE_ENV === 'development') {
	register(require('../../utils/DevTools'));
}
