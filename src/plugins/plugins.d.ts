import { ReactNode } from 'react';

declare global {
	namespace Plugin {
		type Initializer<S> = (prevState: Maybe<S>) => S;

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

		type Configuration = Readonly<{
			order: number;
			type: string;
			extension: string;
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
