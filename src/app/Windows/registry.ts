declare global {
	namespace Windows {
		interface Registry {}

		type SetWindow<Id extends string> = {
			id: Id;
		};

		type Module<T extends keyof Registry> = {
			id: Registry[T]['id'];
			title: string;
			icon: IconType;
			Content: React.FC;
			menuEntry?: {
				order: number;
				Label?: React.FC;
			};
		};

		type AnyModule = Module<keyof Registry>;
	}
}

export const windowRegistry = new Map<
	Windows.AnyModule['id'],
	Windows.AnyModule
>();

const register = (windowModule: Windows.AnyModule) => {
	windowRegistry.set(windowModule.id, windowModule);
};

const ctx = require.context('./modules', false, /\.tsx$/);
ctx.keys().forEach((key) => register(ctx<Windows.AnyModule>(key)));

if (process.env.NODE_ENV === 'development') {
	register(require('../../utils/DevTools'));
}
