export {};

declare global {
	namespace Plugin {
		type Initializer<S> = (prevState: Maybe<S>) => S;

		type LazyModule = {
			Component: React.FC<Plugin.ComponentProps<any, any>>;
			init: Initializer<any>;
			handlers: any;
		};

		type Configuration = Readonly<{
			order: number;
			type: string;
			extension: string;
			icon: Icon;
			label: string;
			getLazyModule: () => Promise<LazyModule>;
		}>;

		type ComponentProps<T, D extends Actions.DispatcherMap<any>> = {
			state: T;
			dispatch: D;
		};

		type Dispatchers<T extends AnyObject> = {
			[K in keyof T]: Actions.Dispatcher<
				[payload: Parameters<T[K]>[1]],
				{},
				Actions.ExtractActions<T>
			>;
		};

		type Dispatch<T extends AnyObject> = Actions.DispatcherMap<
			Plugin.Dispatchers<T>
		>;
	}
}
