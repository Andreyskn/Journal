import { ReactNode } from 'react';

declare global {
	namespace Plugin {
		interface Registry {}

		type SetPlugin<T, E> = {
			type: T;
			extension: E;
		};

		type Type = Registry[keyof Registry]['type'];
		type Extension = Registry[keyof Registry]['extension'];

		type Initializer<S> = (prevState: Maybe<S | string>) => S;

		type Render<S, D extends Dispatch<any>> = (
			state: S,
			dispatch: D
		) => {
			main: ReactNode;
			toolbarContent?: ReactNode | ReactNode[];
		};

		type Show<S> = (state: S) => string;

		type LazyModule = {
			initState: Initializer<any>;
			handlers: any;
			render: Render<any, any>;
		};

		type Configuration<T extends keyof Registry> = Readonly<{
			order: number;
			type: Registry[T]['type'];
			extension: Registry[T]['extension'];
			icon: IconType;
			label: string;
			getLazyModule: () => Promise<LazyModule>;
			show: Show<any>;
		}>;

		type ComponentProps<S, D extends Dispatch<any>> = {
			state: S;
			dispatch: D;
		};

		type Dispatchers<T extends AnyObject> = {
			[K in keyof T]: Actions.Dispatcher<
				[payload: Parameters<T[K]>[1]],
				Actions.ExtractActions<T>
			>;
		};

		type Dispatch<T extends AnyObject> = Actions.DispatcherMap<
			Plugin.Dispatchers<T>
		>;
	}
}
